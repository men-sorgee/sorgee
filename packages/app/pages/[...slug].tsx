import { Key, useEffect, useState } from 'react'
import { Markdown, LinkButton, SubscribeBox } from 'components/controls'
import Section from 'components/Section'
import Page from 'components/Page'
import { listActivePages } from 'lib/services/directus/static'
import { Page as PageModel } from 'lib/models'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Flex, HStack } from '@chakra-ui/react'
import { useSite } from '../hooks/use-site'
import NotFound from '../components/NotFound'

interface Params extends ParsedUrlQuery {
  slug: string[]
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const pages = await listActivePages()
  const paths = pages?.map((page) => ({
    params: { slug: page.slug.split('/') },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

interface Props {
  page: PageModel
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const pages = await listActivePages()
  const { slug } = params
  const path = slug.join('/')
  const page = pages.find((p) => p.slug === path)
  if (!page) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      page,
    },
  }
}

export default function DynamicPage({ page }: Props) {
  const { site, loading } = useSite()
  const [nextText, setNextText] = useState<string>(null)
  const [nextUrl, setNextUrl] = useState<string>('')

  const { title, id, description, image, markdown, content, next_page, next_page_params } = page

  useEffect(() => {
    if (!loading && next_page) {
      const { title: t, slug: s } = next_page
      setNextText(t)
      if (s === 'index') setNextUrl('/')
      else setNextUrl(next_page.slug[0] == '/' ? next_page.slug : `/${next_page.slug}`)
    }
    if (!loading && next_page) {
      const { title, slug } = next_page
      setNextText(title)
      setNextUrl(slug[0] === '/' ? slug : `/${slug}` + (next_page_params || ''))
    }
  }, [nextText, site, loading, next_page, next_page_params])
  if (!page) {
    return <NotFound />
  }
  return (
    <Page id={id} title={title} description={description} image={image?.id}>
      <Flex direction="column" as="section" gap={4} mx="auto">
        <Markdown content={markdown} />
      </Flex>
      <HStack>
        {!site.invite_only && (
          <LinkButton my={8} colorScheme="accent" size="lg" href="/apply">
            Get Started
          </LinkButton>
        )}
        {nextUrl && (
          <LinkButton my={8} colorScheme="secondary" size="lg" href={nextUrl}>
            {nextText}
          </LinkButton>
        )}
      </HStack>
      <>
        {content.map((s: any, i: Key) => (
          <Section key={i} content={s} />
        ))}
      </>
      <SubscribeBox />
    </Page>
  )
}

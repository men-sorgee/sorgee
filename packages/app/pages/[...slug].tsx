import { Key, useEffect, useState } from 'react'
import { Markdown, LinkButton, Subscribe } from 'components/ui'
import Section from 'components/Section'
import Page from 'components/Page'
import { listActivePages } from 'lib/services/directus/static'
import { Page as PageModel } from 'lib/models'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Stack, HStack } from '@chakra-ui/react'
import { sentenceCase } from 'change-case'
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

  const { title, description, image, markdown, content, next, next_page } = page

  useEffect(() => {
    if (!loading && next_page) {
      const { title: t, slug: s } = next_page
      setNextText(t)
      if (s === 'home') setNextUrl('/')
      else setNextUrl(`/${next_page.slug}`)
    }
    if (!loading && next) {
      setNextText(sentenceCase(next.split('/').join(' ').trim()))
      setNextUrl(next[0] === '/' ? next : `/${next}`)
    }
  }, [nextText, site, loading, next_page, next])
  if (!page) {
    return <NotFound />
  }
  return (
    <Page title={title} description={description} image={image?.id}>
      <Stack as="section" spacing={4} maxW="lg">
        <Markdown content={markdown} />
      </Stack>
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
      <Subscribe />
    </Page>
  )
}

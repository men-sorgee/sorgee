import { Key } from 'react'
import { Markdown, LinkButton } from 'components/ui'
import Section from 'components/Section'
import Page from 'components/Page'
import { listActivePages } from 'lib/services/directus/static'
import { Page as PageModel } from 'lib/models'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Stack, Heading, Center } from '@chakra-ui/react'

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

  let { slug } = params

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
  if (!page) {
    return <div>Page not found</div>
  }
  const { title, description, image, markdown, content, next } = page

  return (
    <Page title={title} description={description} image={image?.id}>
      <Stack as="section" spacing={4}>
        <Markdown content={markdown} />
      </Stack>
      {next && (
        <LinkButton my={8} colorScheme="accent" size="lg" href={next}>
          Learn More
        </LinkButton>
      )}
      <>
        {content.map((s: any, i: Key) => (
          <Section key={i} content={s} />
        ))}
      </>
    </Page>
  )
}

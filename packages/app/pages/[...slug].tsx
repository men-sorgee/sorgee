import { cache, Key, useMemo } from 'react'
import Markdown from 'components/ui/Markdown'
import Section from 'components/Section'
import { setMeta } from 'lib/hooks'
import { listActivePages } from 'lib/services/directus/static'
import { Page } from 'lib/models'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { getAssetUrl } from '../lib/utils'

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
  page: Page
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
  const { title, description, image, markdown, content } = page
  setMeta(title, description, image?.id)

  return (
    <article>
      <h1>{title}</h1>
      <section>
        <Markdown content={markdown} />
      </section>
      <>
        {content.map((s: any, i: Key) => (
          <Section key={i} content={s} />
        ))}
      </>
    </article>
  )
}

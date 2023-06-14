import { Key, useEffect, useState } from 'react'

import { ButtonLink, Markdown } from 'components/controls'
import NotFound from 'components/NotFound'
import Page from 'components/Page'
import Section from 'components/Section'
import { useSite } from 'hooks/use-site'
import { Page as PageModel } from 'lib/models'
import NextLink from 'next/link'
import { ParsedUrlQuery } from 'querystring'

import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  useBreakpointValue
} from '@chakra-ui/react'

interface Params extends ParsedUrlQuery {
  slug: string[]
}

export const getStaticPaths = async () => {
  const { listPages } = await import('lib/services/directus/static')
  const pages = await listPages()
  const paths = pages
    ?.filter((p) => !p.static && !p.blog_article && !p.slug.startsWith('blog'))
    .map((page) => ({
      params: { slug: page.slug.split('/') }
    }))
  return {
    paths,
    fallback: 'blocking'
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('exported pages', () => {
    expect(getStaticPaths).toBeDefined()
    getStaticPaths().then(
      ({
        paths, // An array of all the paths that the plugin found
        fallback // The fallback object that the plugin generated
      }) => {
        expect(paths.length).toBeGreaterThan(0)
        expect(fallback).toBe('blocking')
      }
    )
  })
}

interface Props {
  page: PageModel
}

export const getStaticProps = async ({ params }: { params: Params }) => {
  const { listPages } = await import('lib/services/directus/static')
  const pages = await listPages()
  const { slug } = params
  const path = slug.join('/')
  const page = pages.find((p) => p.slug === path)
  if (!page) {
    return {
      notFound: true
    }
  }
  if (page.children?.length) {
    const children = await listPages(page.id)
    page.children = children.filter((c) => c.status === 'published')
  }
  if (page.parent?.id) {
    const parent = pages.find((p) => p.id == page.parent.id)
    page.parent = parent
  }
  return {
    props: {
      page
    }
  }
}

export default function DynamicPage({ page }: Props) {
  const { site, loading } = useSite()
  const [nextText, setNextText] = useState<string>(null)
  const [nextUrl, setNextUrl] = useState<string>('')

  const {
    title,
    id,
    description,
    image,
    markdown,
    content,
    next_page,
    next_page_params,
    parent
  } = page

  useEffect(() => {
    if (!loading && next_page) {
      const { title: t, slug: s } = next_page
      setNextText(t)
      if (s === 'index') setNextUrl('/')
      else
        setNextUrl(
          next_page.slug[0] == '/' ? next_page.slug : `/${next_page.slug}`
        )
    }
    if (!loading && next_page) {
      const { title, slug } = next_page
      setNextText(title)
      setNextUrl(slug[0] === '/' ? slug : `/${slug}` + (next_page_params || ''))
    }
  }, [nextText, site, loading, next_page, next_page_params])
  const imageWidth = useBreakpointValue(['100%', '100%', '50%'])
  if (!page) {
    return <NotFound />
  }
  return (
    <Page
      id={id}
      title={title}
      description={description}
      image={image?.id}
      header={
        parent && (
          <Breadcrumb
            fontSize={['md', 'lg', 'xl']}
            spacing="8px"
            separator={<ChevronRightIcon color="text" />}
            fontWeight="extrabold"
            color="text"
          >
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href={parent.slug}>
                {parent.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )
      }
    >
      <Flex direction="column" as="section" gap={2} mx="auto">
        <Box
          css={{
            a: {
              color: 'text',

              display: 'inline-block',
              svg: {
                display: 'inline-block',
                verticalAlign: 'middle',
                paddingBottom: '0.25rem',
                marginRight: '0.5rem'
              }
            },
            p: {
              marginBottom: '1rem'
            },

            img: {
              maxWidth: imageWidth,
              display: 'inline-block',
              float: 'left',
              margin: '.5rem 1rem 1rem 0'
            },
            h2: {
              clear: 'both'
            }
          }}
        >
          <Markdown content={markdown} />
        </Box>
        {content.map((s: any, i: Key) => (
          <Section key={i} content={s} />
        ))}
      </Flex>
      <HStack spacing={4}>
        {!site.invite_only && (
          <ButtonLink my={8} colorScheme="accent" size="lg" href="/apply">
            Get Started
          </ButtonLink>
        )}
        {nextUrl && (
          <ButtonLink my={8} colorScheme="secondary" size="lg" href={nextUrl}>
            {nextText}
          </ButtonLink>
        )}
      </HStack>
    </Page>
  )
}

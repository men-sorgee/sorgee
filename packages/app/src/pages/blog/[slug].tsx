import { Markdown, NotFound, Page } from "components";
import { pages as pageIds } from "lib/config";
import { Page as PageModel } from "lib/models";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import NextLink from "next/link";
import { ParsedUrlQuery } from "querystring";

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  useBreakpointValue
} from "@chakra-ui/react";

interface Params extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const { listPages } = await import('lib/services/directus/server/pages')
  const pages = await listPages(pageIds.blogPage)
  const paths = pages.map((page) => ({
    params: { slug: page.slug.split('/')[1] },
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
  const { getPageBySlug } = await import('lib/services/directus/server/pages')
  const { slug } = params
  const page = await getPageBySlug(slug)

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

export default function BlogPage({ page }: Props) {
  const { title, id, description, parent, image, markdown, next_page } = page
  const imageWidth = useBreakpointValue(['100%', '100%', '50%'])
  if (!page) {
    return <NotFound />
  }

  const nextUrl = next_page
    ? next_page.parent
      ? `/${next_page.parent.slug}/${next_page.slug}`
      : `/${next_page.slug}`
    : null

  return (
    <Page
      css={{
        'h1:first-of-type': {
          display: 'none',
        },
      }}
      id={id}
      title={title}
      description={description}
      image={image?.id}
    >
      <Flex direction="column" as="section" gap={4} mx="auto" mt={10}>
        <Breadcrumb
          fontSize={['sm', 'md', 'lg']}
          spacing="8px"
          separator={<ChevronRightIcon color="text" />}
          color="text"
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={NextLink} href={'/blog'}>
              {parent.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1>{title}</h1>
        <Box
          css={{
            a: {
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid',
              borderColor: 'text',
              color: 'text',
              fontSize: '1.6rem',
              marginTop: '1rem',
              display: 'inline-block',
              svg: {
                display: 'inline-block',
                verticalAlign: 'middle',
                paddingBottom: '0.25rem',
                marginRight: '0.5rem',
              },
            },
            p: {
              marginBottom: '1rem',
            },
            img: {
              maxWidth: imageWidth,
              display: 'inline-block',
              float: 'left',
              margin: '.5rem 1rem 1rem 0',
            },
          }}
        >
          <Markdown content={markdown} size="lg" />
        </Box>
      </Flex>
      <Box textAlign="right" mt={4}>
        {next_page && (
          <Link
            as={NextLink}
            my={8}
            textDecoration="underline"
            colorScheme="secondary"
            fontSize="xl"
            href={nextUrl}
          >
            <ChevronRightIcon color="text" />
            Next article: {next_page.title}
          </Link>
        )}
      </Box>
    </Page>
  )
}

'use client'
import Page from 'components/Page'
import { format } from 'date-fns'
import { Page as PageModel } from 'lib/models'
import { getAssetUrl } from 'lib/utils'
import NextLink from 'next/link'
import { NextRouter, useRouter } from 'next/router'

import {
  Box,
  Divider,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

import { Markdown } from '../../components/controls'

export async function getServerSideProps(_context) {
  const { getPageBySlug } = await import('lib/services/directus/static')
  const page = await getPageBySlug('blog')

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

const Article = ({ page, router }: { page: PageModel; router: NextRouter }) => {
  const date = new Date(page.published)
  return (
    <Box mb={4}>
      {page.image && (
        <Image
          borderRadius="lg"
          transform="scale(1.0)"
          transition="0.3s ease-in-out"
          _hover={{
            transform: 'scale(1.05)',
            cursor: 'pointer',
          }}
          src={getAssetUrl(page.image.id)}
          alt={page.image.title}
          objectFit="cover"
          h="10rem"
          w="full"
          onClick={() => {
            router.push(`/blog/${page.slug}`)
          }}
        />
      )}
      <LinkBox rounded="lg" mt={2}>
        <Text
          as="span"
          textShadow="2px 2px 1px #000000"
          stroke="black"
          fontSize="sm"
          fontWeight="bold"
          color="white"
          mt="-3rem"
          ml=".5rem"
          zIndex={10}
          position="absolute"
          bg="blackAlpha.600"
          py={1}
          px={2}
          rounded="full"
        >
          {format(date, `MMMM`) + ` '` + format(date, 'yy')}
        </Text>
        <Heading fontSize="xl" my={4}>
          <LinkOverlay
            as={NextLink}
            textDecoration="none"
            href={`/blog/${page.slug}`}
            _hover={{ textDecoration: 'none' }}
          >
            <Text noOfLines={1} as="span">
              {page.title}
            </Text>
          </LinkOverlay>
        </Heading>
        <Text noOfLines={5}>{page.description}</Text>
      </LinkBox>
    </Box>
  )
}

type Props = {
  page: PageModel
}

export default function Blog({ page }: Props) {
  const { title, description, image, markdown, content, next_page, children: c } = page
  const articles = (c as PageModel[])
    .filter((p) => page.status === 'published')
    .sort((a, b) => {
      const dateA = new Date(a.published).getTime()
      const dateB = new Date(b.published).getTime()

      // Compare the dates and sort in reverse order
      return dateB - dateA
    })
  const router = useRouter()
  const [latest, ...children] = articles
  const bg = useColorModeValue(
    'radial(orange.600 1px, transparent 1px)',
    'radial(orange.300 1px, transparent 1px)'
  )
  const date = new Date(latest.published)
  return (
    <Page title={title} description={description} image={getAssetUrl(image)}>
      <Box>
        <Markdown content={description} size="xl" />
      </Box>
      {latest && (
        <LinkBox>
          <Heading as="h2" mt={8} mb={0}>
            Latest Article:
          </Heading>

          <Box
            marginTop={{ base: '1', sm: '5' }}
            display="flex"
            flexDirection={{ base: 'column', sm: 'row' }}
            justifyContent="space-between"
          >
            <Box display="flex" flex="1" marginRight="3" position="relative" alignItems="center">
              <Box
                width={{ base: '100%', sm: '85%' }}
                zIndex="2"
                marginLeft={{ base: '0', sm: '5%' }}
                marginTop="5%"
              >
                {latest.image && (
                  <Image
                    borderRadius="lg"
                    transform="scale(1.0)"
                    transition="0.3s ease-in-out"
                    _hover={{
                      transform: 'scale(1.05)',
                      cursor: 'pointer',
                    }}
                    src={getAssetUrl(latest.image.id)}
                    alt={latest.image.title}
                    objectFit="cover"
                    onClick={() => {
                      router.push(`/blog/${latest.slug}`)
                    }}
                  />
                )}
                <Text
                  as="span"
                  textShadow="2px 2px 1px #000000"
                  stroke="black"
                  fontSize="sm"
                  fontWeight="bold"
                  color="white"
                  mt="-2rem"
                  ml=".5rem"
                  zIndex={10}
                  position="absolute"
                  bg="blackAlpha.600"
                  py={1}
                  px={2}
                  rounded="full"
                >
                  {format(date, 'MMMM') + ` '` + format(date, 'yy')}
                </Text>
              </Box>
              <Box zIndex="1" width="100%" position="absolute" height="100%">
                <Box bgGradient={bg} backgroundSize="20px 20px" opacity="0.4" height="100%" />
              </Box>
            </Box>
            <Box
              display="flex"
              flex="1"
              flexDirection="column"
              justifyContent="center"
              marginTop={{ base: '3', sm: '0' }}
            >
              <Heading marginTop="1">
                <LinkOverlay
                  as={NextLink}
                  textDecoration="none"
                  href={`/blog/${latest.slug}`}
                  _hover={{ textDecoration: 'none' }}
                >
                  {latest.title}
                </LinkOverlay>
              </Heading>
              <Box marginTop={2}>
                <Markdown content={latest.description} size="lg" />
              </Box>
            </Box>
          </Box>
        </LinkBox>
      )}

      <Divider my={6} />
      <Heading as="h3" size="md" mt={10} mb={0}>
        Recent Articles:
      </Heading>
      <SimpleGrid spacing={6} mt="5" p={[0, 0, 4]} columns={[1, 2, 3]}>
        {children
          .filter((p) => p.slug != latest.slug)
          .map((page) => (
            <Article key={page.slug} page={page} router={router} />
          ))}
      </SimpleGrid>
      <Divider my={6} />
      <Markdown content={markdown} />
    </Page>
  )
}

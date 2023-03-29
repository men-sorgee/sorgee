'use client'
import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  SpaceProps,
  useColorModeValue,
  Container,
  VStack,
  Flex,
  SimpleGrid,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'
import { getAssetUrl } from 'lib/utils'
import { Page as PageModel } from 'lib/models'
import { blogPage } from 'lib/config'
import Page from '../../components/Page'
import { Markdown } from '../../components/controls'
import NextLink from 'next/link'
export async function getStaticProps(_context) {
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

const Article = ({ page }: { page: PageModel }) => {
  return (
    <LinkBox mb={4}>
      {page.image && (
        <Image
          transform="scale(1.0)"
          transition="0.3s ease-in-out"
          _hover={{
            transform: 'scale(1.05)',
          }}
          src={getAssetUrl(page.image.id)}
          alt={page.image.title}
          objectFit="cover"
          w="100%"
          h="10rem"
          borderRadius="lg"
          overflow="hidden"
        />
      )}
      <Heading fontSize="xl" my={4}>
        <LinkOverlay
          as={NextLink}
          textDecoration="none"
          href={`/blog/${page.slug}`}
          _hover={{ textDecoration: 'none' }}
        >
          {page.title}
        </LinkOverlay>
      </Heading>

      <Markdown content={page.description} />
    </LinkBox>
  )
}

type Props = {
  page: PageModel
}

export default function Blog({ page }: Props) {
  const { title, description, image, markdown, content, next_page, children } = page

  const latest = next_page as PageModel
  const color = useColorModeValue('gray.700', 'gray.200')
  const bg = useColorModeValue(
    'radial(orange.600 1px, transparent 1px)',
    'radial(orange.300 1px, transparent 1px)'
  )
  return (
    <Page title={title} description={description} image={getAssetUrl(image)}>
      <Text fontSize="lg" textAlign="justify">
        This is a blog on issues surrounding men&apos;s health. Introducing our Men&apos;s Sexual
        Health Blog - your resource for men seeking information and advice on all aspects of sexual
        health.{' '}
      </Text>
      <Text fontSize="lg" textAlign="justify">
        <strong>
          Our mission is to provide men with the knowledge and resources they need to make informed
          decisions about their sexual health and wellbeing.
        </strong>
      </Text>
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
                    }}
                    src={getAssetUrl(latest.image.id)}
                    alt={latest.image.title}
                    objectFit="cover"
                  />
                )}
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
      <SimpleGrid spacing={6} mt="5" p={[0, 0, 4]} columns={[1, 2, 3, 4]}>
        {children
          .filter((p) => p.slug != latest.slug)
          .map((page) => (
            <Article key={page.slug} page={page} />
          ))}
      </SimpleGrid>
      <Divider my={6} />
      <Markdown content={markdown} />
    </Page>
  )
}

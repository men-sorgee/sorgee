import { useEffect } from 'react'
import { ButtonLink, Markdown, Section } from 'components'
import { useMeta, useUser } from 'hooks'
import { pages } from 'lib/config'
import { Page } from 'lib/models'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

import {
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'

import { useMember, useSite } from '../hooks'

interface Props {
  page: Pick<
    Page,
    | 'title'
    | 'description'
    | 'content'
    | 'markdown'
    | 'image'
    | 'next_page'
    | 'next_page_params'
  >
}

export const getStaticProps = async () => {
  const { getPageById } = await import('lib/services/directus/static')
  const page = await getPageById(pages.homePage)

  return {
    props: {
      page
    }
  }
}

export default function HomePage({ page }: Props) {
  const { authenticated } = useUser()
  const { setMeta } = useMeta()
  const {
    title,
    description,
    content,
    markdown,
    image,
    next_page,
    next_page_params
  } = page
  const { site } = useSite()
  useEffect(() => {
    setMeta(title, description, image?.id)
  })
  const color = useColorModeValue('gray.700', 'gray.100')
  return (
    <>
      <Box
        p={[5, 10, 20, 30]}
        px={4}
        mx={[4, 4, 0]}
        mt={[5, 10, 20]}
        rounded="lg"
        shadow="lg"
        bg={useColorModeValue('white', 'gray.700')}
      >
        <Heading as="h1" textAlign={'center'} size={['2xl', '3xl']}>
          <Text as={'div'} color={'accent.400'}>
            Group Play
          </Text>
          for discrete men
        </Heading>
        <Text
          fontSize={['lg', 'xl', '2xl']}
          maxW={['lg', 'xl', '2xl', '3xl']}
          mx="auto"
          my={6}
          textAlign={'center'}
        >
          A hot new approach to meeting men
        </Text>
        {!authenticated && (
          <Flex
            my={[4, 4, 8]}
            gap={4}
            align="center"
            justify={'center'}
            direction={['column', 'row']}
          >
            {site && !site.invite_only && (
              <ButtonLink size="lg" fontSize="xl" href="/apply" color="white">
                Get Started
              </ButtonLink>
            )}
            {site && !site.invite_only && next_page && <div>or</div>}
            {next_page && (
              <ButtonLink
                size="lg"
                fontSize="xl"
                href={next_page.slug}
                color="white"
              >
                {next_page.title}
              </ButtonLink>
            )}
          </Flex>
        )}
      </Box>
      <Box mx={[4, 4, 0]}>
        {site && site.invite_only && (
          <Text
            fontStyle="italic"
            textAlign={['left', 'center']}
            size="xs"
            color={color}
            mb={[5, 10, 20]}
          >
            <>
              Access to this site is by invite-only while we build and test this
              site. If you would like to join our beta-program and apply for
              early access, DM us on Twitter{' '}
              <Link
                target="_blank"
                rel="noreferrer"
                href="https://twitter.com/guysnheat"
              >
                @guysnheat
              </Link>
            </>
          </Text>
        )}
        <Flex direction="column" gap={8}>
          <Markdown content={markdown} />
          {content?.map((s, i) => (
            <Section key={i} content={s} />
          ))}
        </Flex>
      </Box>
    </>
  )
}

import { useEffect } from 'react'

import { ButtonLink, Markdown, SubscribeBox } from 'components/controls'
import Section from 'components/Section'
import { useMeta, useUser } from 'hooks'
import { pages } from 'lib/config'
import { Page } from 'lib/models'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
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
        <Heading as="h1" textAlign={['left', 'center']} size={['2xl', '3xl']}>
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
          textAlign={['left', 'center']}
        >
          A hot new approach to meeting men
        </Text>
        {!authenticated && (
          <HStack my={[4, 4, 8]} gap={4} align="top" justify={'center'}>
            {site && !site.invite_only && (
              <ButtonLink size="lg" fontSize="3xl" href="/apply" color="white">
                Get Started
              </ButtonLink>
            )}
            {site && !site.invite_only && next_page && <div>or</div>}
            {next_page && (
              <ButtonLink
                size="lg"
                fontSize="3xl"
                href={next_page.slug}
                color="white"
              >
                {next_page.title}
              </ButtonLink>
            )}
          </HStack>
        )}
      </Box>
      <Box mx={[4, 4, 0]}>
        <Text
          fontStyle="italic"
          textAlign={['left', 'center']}
          size="xs"
          color={useColorModeValue('gray.700', 'gray.100')}
          mb={[5, 10, 20]}
        >
          {site && site.invite_only && (
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
          )}{' '}
          Existing members can{' '}
          <Link href="/api/auth/signin" onClick={() => signIn()}>
            enter here
          </Link>
          .{' '}
        </Text>
        <Flex direction="column" gap={8}>
          <Markdown content={markdown} />
          {content?.map((s, i) => (
            <Section key={i} content={s} />
          ))}
        </Flex>
        <SubscribeBox mt={[5, 10, 20]} />
      </Box>
    </>
  )
}

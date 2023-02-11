import { useMeta } from 'hooks/use-meta'
import { getPageContentById } from 'lib/services/directus/static'
import { Markdown, SubscribeBox } from 'components/controls'
import Section from 'components/Section'
import { Page } from 'lib/models'
import { Box, Heading, Text, Center, Flex, useColorModeValue } from '@chakra-ui/react'
import { LinkButton } from 'components/controls'
import { useEffect } from 'react'

interface Props {
  page: Page
}

export const getStaticProps = async () => {
  const page = await getPageContentById('ac330d1b-0340-4a61-9b42-996aa0936d2b')

  return {
    props: {
      page,
    },
  }
}

export default function HomePage({ page }: Props) {
  const { setMeta } = useMeta()
  const { title, description, content, markdown, image, next_page, next_page_params } = page

  useEffect(() => {
    setMeta(title, description, image?.id)
  })

  return (
    <>
      <Box
        py={30}
        px={4}
        my={20}
        rounded="lg"
        shadow="lg"
        bg={useColorModeValue('white', 'gray.700')}
      >
        <Heading textAlign={['left', 'center']} as="h1" size={['2xl', '3xl']}>
          Group Events for <abbr title="men who have sex with men">MSM</abbr>
          <Text as={'div'} color={'accent.400'}>
            made easy
          </Text>
        </Heading>
        <Text
          fontSize={['lg', 'xl', '2xl']}
          maxW={['lg', 'xl', '2xl', '3xl']}
          mx="auto"
          textAlign={['left', 'center']}
        >
          A hot new fraternity, known internally as &quot;The Brotherhood&quot;, this group is for
          bisexual single and married men who value discretion.
        </Text>
        {next_page && (
          <Center my={8}>
            <LinkButton
              bg="accent.500"
              color="white"
              py={8}
              size="lg"
              fontSize="3xl"
              href={next_page.slug}
            >
              {next_page.title}
            </LinkButton>
          </Center>
        )}
      </Box>
      <article>
        <Flex m="auto" direction="column" gap={8} justify="space-between ">
          <Markdown content={markdown} />
          {content?.map((s, i) => (
            <Section key={i} content={s} />
          ))}
          <SubscribeBox />
        </Flex>
        <></>
      </article>
    </>
  )
}

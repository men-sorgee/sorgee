import { useMeta } from 'hooks/use-meta'
import { getPageContentById } from 'lib/services/directus/static'
import { Markdown, Subscribe } from 'components/ui'
import Section from 'components/Section'
import { Page } from 'lib/models'
import { Box, Heading, Text, Center, Flex } from '@chakra-ui/react'
import { LinkButton } from 'components/ui'
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
  const { title, description, content, markdown, image, next, next_page } = page

  useEffect(() => {
    setMeta(title, description, image?.id)
  })

  return (
    <>
      <article>
        <Heading textAlign={['left', 'center']} as="h1" size={['2xl', '3xl']} my={8}>
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
            <LinkButton colorScheme="accent" py={8} size="lg" fontSize="3xl" href={next_page.slug}>
              Learn More
            </LinkButton>
          </Center>
        )}
        <Flex
          m="auto"
          maxW={['full', 'lg', '3xl']}
          direction={{ base: 'column', lg: 'row' }}
          gap={8}
          justify="space-between"
        >
          <Box as="section" textAlign={['left', 'center']}>
            <Markdown content={markdown} />
          </Box>
          <Box as="section" pt={{ base: 0, lg: 4 }}>
            <Subscribe />
          </Box>
        </Flex>
        <>
          {content?.map((s, i) => (
            <Section key={i} content={s} />
          ))}
        </>
      </article>
    </>
  )
}

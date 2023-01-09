import { setMeta } from 'hooks'
import { getPageContentById } from 'lib/services/directus/static'
import { Markdown, Subscribe } from 'components/ui'
import Section from 'components/Section'
import { Page } from 'lib/models'
import { Box, Heading, Text, Center, Stack } from '@chakra-ui/react'
import { LinkButton } from 'components/ui'

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
  const { title, description, content, markdown, image, next } = page
  setMeta(title, description, image?.id)

  return (
    <>
      <article>
        <Heading
          textAlign={['left', 'center']}
          as="h1"
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
        >
          Sexual/Social Group Events
          <Text as={'div'} color={'accent.400'}>
            made easy for <abbr title="men who have sex with men">MSM</abbr>
          </Text>
        </Heading>
        <Text
          fontSize={['lg', 'xl', '2xl']}
          maxW={['lg', 'xl', '2xl']}
          mx="auto"
          textAlign="justify"
        >
          A hot new fraternity, known internally as &quot;The Brotherhood&quot;, this group is for
          bisexual single and married men who value discretion.
        </Text>
        {next && (
          <Center mb={8}>
            <LinkButton colorScheme="accent" size="lg" fontSize="3xl" href="/learn">
              Learn More
            </LinkButton>
          </Center>
        )}
        <Stack
          m="auto"
          maxW={{ base: 'full', sm: 'lg' }}
          direction={{ base: 'column', lg: 'row' }}
          spacing={8}
          justify="space-between"
        >
          <Box as="section" textAlign={['left', 'center']}>
            <Markdown content={markdown} />
          </Box>
          <Box as="section" pt={{ base: 0, lg: 4 }}>
            <Subscribe />
          </Box>
        </Stack>
        <>
          {content?.map((s, i) => (
            <Section key={i} content={s} />
          ))}
        </>
      </article>
    </>
  )
}

import { setMeta } from 'hooks'
import { getPageContentById } from 'lib/services/directus/static'
import { Markdown, Subscribe } from 'components/ui'
import Section from 'components/Section'
import { Page } from 'lib/models'
import { Stack, Box } from '@chakra-ui/react'

interface Props {
  page: Page
}

export default function HomePage({ page }: Props) {
  const { title, description, content, markdown, image } = page
  setMeta(title, description, image?.id)

  return (
    <>
      <article>
        <Stack direction={{ base: 'column', lg: 'row' }} spacing={4} justify="space-between">
          <Box as="section" w="auto" maxW={{ base: 'full', sm: '2xl' }}>
            <Markdown content={markdown} />
          </Box>
          <Box as="section" pt={{ base: 0, lg: 20 }}>
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

export const getStaticProps = async () => {
  const page = await getPageContentById('ac330d1b-0340-4a61-9b42-996aa0936d2b')

  return {
    props: {
      page,
    },
  }
}

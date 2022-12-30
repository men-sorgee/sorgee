import { setMeta } from 'hooks'
import { getPageContentById } from '@/lib/services/directus/static'
import { Markdown, Subscribe } from 'components/ui'
import Section from 'components/Section'
import { Page } from 'lib/models'
import { getAssetUrl } from '@/lib/utils'

interface Props {
  page: Page
}

export default function HomePage({ page }: Props) {
  const { title, description, content, markdown, image } = page
  setMeta(title, description, image?.id)

  return (
    <article>
      <section>
        <Markdown content={markdown} />
      </section>
      <section className="gradient mt-8  rounded-xl p-4">
        <Subscribe />
      </section>
      <>
        {content?.map((s, i) => (
          <Section key={i} content={s} />
        ))}
      </>
    </article>
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

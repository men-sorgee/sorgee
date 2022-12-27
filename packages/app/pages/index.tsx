import { NextPage } from 'next';
import { setMeta } from 'lib/hooks/use-meta-context';
import { getPageContentById } from 'lib/services/directus/static';
import { Markdown, Subscribe } from '../components/ui';
import Section from '../components/layout/Section';
import { Page } from 'lib/models';
import { getAssetUrl } from 'lib/utils/client';
import { PageItem } from 'lib/models';
interface Props {
  page: Page;
}

const Page: NextPage<Props> = ({ page }: Props) => {
  const { title, description, content, markdown, image } = page;
  const img = image?.id ? getAssetUrl(image.id) : null;
  setMeta(title, description, img);

  return (
    <article>
      <section>
        <Markdown content={markdown} />
      </section>
      <section className="gradient mt-8 min-w-fit rounded-xl p-4 md:mx-auto md:max-w-md">
        <Subscribe />
      </section>
      <>
        {content.map((s, i) => (
          <Section key={i} content={s} />
        ))}
      </>
    </article>
  );
};

Page.getInitialProps = async () => {
  const page = await getPageContentById('ac330d1b-0340-4a61-9b42-996aa0936d2b');

  return {
    page
  };
};

export default Page;

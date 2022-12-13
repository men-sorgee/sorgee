import React from 'react';
import { NextPage } from 'next';
import { useMeta } from 'lib/hooks/use-meta-context';
import {
  listActivePages,
  getPageContentById,
  MenuPage,
  SectionPage
} from 'lib/services/directus/static';
import Markdown from 'components/layout/Markdown';
import Section from 'components/layout/Section';
import Subscribe from 'components/layout/Subscribe';

interface Props {
  page: SectionPage;
  pages: MenuPage[];
}

const Page: NextPage<Props> = ({ page, pages }: Props) => {
  const { title, description, content, markdown, image } = page;
  const img = image ? `/api/asset/${image.id}` : null;
  useMeta(title, description, img, pages);

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

Page.getInitialProps = async (context) => {
  const pages = await listActivePages();
  const page = await getPageContentById('ac330d1b-0340-4a61-9b42-996aa0936d2b');

  return {
    page,
    pages: pages
      .filter((p) => p.in_menu)
      .map((p) => {
        return { title: p.title, path: `/${p.slug}` };
      })
  };
};

export default Page;

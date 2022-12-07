import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useMeta } from '../lib/hooks/use-meta-context';
import {
  getActivePages,
  getPageContentById
} from '../lib/services/directus/static';
import Section from '../components/layout/Section';
import { MenuPage, SectionPage } from '../lib/services/directus';
import Subscribe from '../components/layout/Subscribe';
import Markdown from '../components/layout/Markdown';

interface Props {
  page: SectionPage;
  pages: MenuPage[];
}

const Page: NextPage<Props> = ({ page, pages }: Props) => {
  const { title, description, content, markdown, image } = page;
  const img = image ? `/api/asset/${image.id}` : null;
  useMeta(title, description, img, pages);

  return (
    <>
      <>
        {content.map((s, i) => (
          <Section key={i} content={s} />
        ))}
      </>
      <Markdown content={markdown} />
      <section className="gradient  rounded-xl py-2">
        <Subscribe />
      </section>
    </>
  );
};

Page.getInitialProps = async (context) => {
  const pages = await getActivePages();
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

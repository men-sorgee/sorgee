import Head from 'next/head';
import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { useMeta } from '../lib/hooks/user-meta-context';
import { getPageContentById } from '../lib/services/directus/static';
import Section from '../components/layout/Section';
import { CMSPageProps, SectionPage } from '../lib/services/directus';
import Subscribe from '../components/layout/Subscribe';
import Markdown from '../components/layout/Markdown';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = await getPageContentById('ac330d1b-0340-4a61-9b42-996aa0936d2b');

  return {
    props: {
      page
    }
  };
};

export default function Home({ page }: { page: SectionPage }) {
  const { title, description, content, markdown } = page;
  useMeta(title, description);

  return (
    <>
      <>
        {content.map((s, i) => (
          <Section key={i} content={s} />
        ))}
      </>
      <Markdown content={markdown} />
      <section className="dark py-8 ">
        <Subscribe />
      </section>
    </>
  );
}

import Head from 'next/head';
import React, { useEffect } from 'react';

import { Button } from 'react-daisyui';
import FieldInput from '../components/forms/FieldInput';
import { GetServerSideProps, GetStaticProps } from 'next';
import { useMeta } from '../lib/hooks/user-meta-context';
import { getPageContent } from '../lib/services/directus/static';
import Section from '../components/layout/Section';
import { CMSPageProps, ContentSection } from '../lib/services/directus';
import Subscribe from '../components/layout/Subscribe';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = await getPageContent('ac330d1b-0340-4a61-9b42-996aa0936d2b');
  const { title, description, content } = page;
  return {
    props: {
      title,
      description,
      content
    }
  };
};

export default function Home({ title, description, content }: CMSPageProps) {
  useMeta(title, description);

  return (
    <>
      <>
        {content.map((s, i) => (
          <Section key={i} content={s} />
        ))}
      </>
      <section className="dark py-8 ">
        <Subscribe />
      </section>
    </>
  );
}

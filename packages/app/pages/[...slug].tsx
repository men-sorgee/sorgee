import { Key } from 'react';
import Markdown from 'components/layout/Markdown';
import Section from 'components/layout/Section';
import { useMeta } from 'lib/hooks/use-meta-context';
import {
  MenuPage,
  SectionPage,
  listActivePages,
  getPageContentByUrl
} from '../lib/services/directus/static';

export const getStaticPaths = async () => {
  const pages = await listActivePages();
  const paths = pages.map((page) => ({
    params: { slug: page.slug.split('/') }
  }));
  return {
    paths,
    fallback: false
  };
};

export async function getStaticProps({ params }) {
  const pages = await listActivePages();

  let { slug: paths } = params as { slug: string[] };

  const slug = paths?.pop();
  if (!slug) {
    return {
      notFound: true
    };
  }

  const page = await getPageContentByUrl(slug);

  if (!page) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      page,
      pages: pages
        .filter((p) => p.in_menu)
        .map((p) => {
          return { title: p.title, path: `/${p.slug}` };
        })
    }
  };
}

export default function Page({
  page,
  pages
}: {
  page: SectionPage;
  pages: MenuPage[];
}) {
  const { title, description, image, markdown, content } = page;
  const img = image ? `/api/asset/${image.id}` : null;
  useMeta(title, description, img, pages);
  return (
    <>
      <h1>{title}</h1>
      <section>
        <Markdown content={markdown} />
      </section>
      <>
        {content.map((s: any, i: Key) => (
          <Section key={i} content={s} />
        ))}
      </>
    </>
  );
}

import { GetServerSideProps } from 'next';
import Markdown from '../../components/layout/Markdown';
import Section from '../../components/layout/Section';
import { useMeta } from '../../lib/hooks/user-meta-context';
import { SectionPage } from '../../lib/services/directus';
import {
  getActivePages,
  getPageContentByUrl
} from '../../lib/services/directus/static';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pages = await getActivePages();
  const page =
    pages.find((p) => (p.slug = context.query.slug[0])) ||
    (await getPageContentByUrl(context.query.slug[0] as string));

  if (!page) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      page,
      pages
    }
  };
};

export default function Page({
  page,
  pages
}: {
  page: SectionPage;
  pages: SectionPage[];
}) {
  const { title, description, image, markdown } = page;
  useMeta(
    title,
    description,
    `/api/asset/${image}`,
    pages
      .map((p) => (p.in_menu ? { title: p.title, path: p.slug } : null))
      .filter((p) => p)
  );
  return (
    <>
      <section>
        <Markdown content={markdown} />
      </section>
    </>
  );
}

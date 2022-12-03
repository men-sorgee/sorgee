import Markdown from '../components/layout/Markdown';
import { useMeta } from '../lib/hooks/use-meta-context';
import { MenuPage, SectionPage } from '../lib/services/directus';
import {
  getActivePages,
  getPageContentByUrl
} from '../lib/services/directus/static';

export const getStaticPaths = async () => {
  const pages = await getActivePages();
  const paths = pages.map((page) => ({
    params: { slug: page.slug.split('/') }
  }));
  return {
    paths,
    fallback: 'blocking'
  };
};

export async function getStaticProps({ params }) {
  const pages = await getActivePages();

  let { slug: paths } = params as { slug: string[] };
  const slug = paths.pop();

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
  const { title, description, image, markdown } = page;
  const img = image ? `/api/asset/${image}` : null;
  useMeta(title, description, img, pages);
  return (
    <>
      <section>
        <Markdown content={markdown} />
      </section>
      {}
    </>
  );
}

import { GetServerSideProps } from 'next';
import Section from '../../components/layout/Section';
import { useMeta } from '../../lib/hooks/user-meta-context';
import { CMSPageProps } from '../../lib/services/directus';
import { getPageContentByUrl } from '../../lib/services/directus/static';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = await getPageContentByUrl(context.query.url[1] as string);
  if (!page) {
    return {
      notFound: true
    };
  }

  const { title = null, description = null, content = [] } = page;
  return {
    props: {
      title,
      description,
      content
    }
  };
};

export default function Page({ title, description, content }: CMSPageProps) {
  useMeta(title, description);
  return (
    <>
      {content.map((s, i) => (
        <Section key={i} content={s} />
      ))}
    </>
  );
}

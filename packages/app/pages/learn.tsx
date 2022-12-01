import { GetServerSideProps } from 'next';
import Section from '../components/layout/Section';
import { useMeta } from '../lib/hooks/user-meta-context';
import { CMSPageProps } from '../lib/services/directus';
import { getPageContent } from '../lib/services/directus/static';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageId = 'b9c6b568-677f-4677-b6fb-d34f09af574f';
  const page = await getPageContent(pageId);
  const { title, description, content } = page;
  return {
    props: {
      title,
      description,
      content
    }
  };
};

export default function Learn({ title, description, content }: CMSPageProps) {
  useMeta(title, description);
  return (
    <>
      {content.map((s, i) => (
        <Section key={i} content={s} />
      ))}
    </>
  );
}

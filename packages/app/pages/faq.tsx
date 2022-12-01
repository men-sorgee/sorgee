import { GetServerSideProps } from 'next';
import Section from '../components/layout/Section';
import { useMeta } from '../lib/hooks/user-meta-context';
import { CMSPageProps } from '../lib/services/directus';
import { getPageContent } from '../lib/services/directus/static';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageId = '3589c98a-5943-4b41-a554-03392a73be1c';
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

export default function FAQ({ title, description, content }: CMSPageProps) {
  useMeta(title, description);
  return (
    <>
      {content.map((s, i) => (
        <Section key={i} content={s} />
      ))}
    </>
  );
}

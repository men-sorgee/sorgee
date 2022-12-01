import { GetServerSideProps } from 'next';
import Section from '../components/layout/Section';
import { useMeta } from '../lib/hooks/user-meta-context';
import { CMSPageProps } from '../lib/services/directus';
import { getPageContent } from '../lib/services/directus/static';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = await getPageContent('9f419544-5f62-4123-8cfc-d35c71085377');
  const { title, description, content } = page;
  return {
    props: {
      title,
      description,
      content
    }
  };
};

export default function About({ title, description, content }: CMSPageProps) {
  useMeta(title, description);
  return (
    <>
      {content.map((s, i) => (
        <Section key={i} content={s} />
      ))}
    </>
  );
}

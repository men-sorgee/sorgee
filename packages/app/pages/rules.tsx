import { GetStaticProps } from 'next';
import { useMeta } from '../lib/hooks/user-meta-context';
export const getStaticProps: GetStaticProps = async (context) => {
  const pageId = '21adb349-b96c-4234-9044-a825736f22f5';
  return {
    props: {}
  };
};

export default function Rules() {
  useMeta('Rules');
  return (
    <>
      =<section className="w-full bg-white p-8 text-black">\</section>
    </>
  );
}

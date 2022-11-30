import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useMeta } from '../lib/hooks/user-meta-context';
export const getStaticProps: GetStaticProps = async (context) => {
  const pageId = 'b9c6b568-677f-4677-b6fb-d34f09af574f';
  return {
    props: {}
  };
};

export default function Learn() {
  useMeta('Learn');
  return (
    <>
      <section className="w-full bg-white p-8 text-black">
        <h2 className=" ">Learn</h2>
        <h3 className=" ">How it Works</h3>
      </section>
    </>
  );
}

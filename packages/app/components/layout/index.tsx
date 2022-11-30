import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import { ReactNode } from 'react';
import getConfig from 'next/config';
import 'react';
import Meta, { MetaProps } from '../meta';

interface Props {
  children: ReactNode | ReactNode[];
  meta?: MetaProps;
}
const { publicRuntimeConfig } = getConfig();

export default function Layout({ children, meta: pageMeta }: Props) {
  const router = useRouter();

  const meta: MetaProps = {
    title: publicRuntimeConfig.title,
    description: publicRuntimeConfig.description,
    basePath: router.basePath,
    url: `${router.basePath}${router.asPath}`,
    ...pageMeta
  };

  return (
    <>
      <Meta props={meta} />
      <Header path={router.asPath} />
      <div className="mx-auto max-w-6xl p-4">
        <main className="min-h-[calc(100vh-10rem)] bg-gray-800">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}

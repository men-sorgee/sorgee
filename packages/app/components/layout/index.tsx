import Meta from '../meta';
import Header from './Header';
import Footer from './Footer';
import 'react';
import { useMetaContext } from 'lib/hooks/user-meta-context';
import { Props } from 'lib/types';

export default function Layout({ children }: Props) {
  const { path } = useMetaContext();
  return (
    <>
      <Meta>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Meta>
      <Header path={path} />
      <main>
        <article>{children}</article>
        <Footer />
      </main>
    </>
  );
}

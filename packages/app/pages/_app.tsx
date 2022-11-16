import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from 'components/layout';
import twindConfig from 'twind.config';
import withTwindApp from '@twind/next/app';
// import { UserContextProvider } from 'lib/hooks/use-user';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}

export default withTwindApp(twindConfig, MyApp);

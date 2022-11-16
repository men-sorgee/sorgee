import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from 'components/layout';
import twindConfig from 'twind.config';
import withTwindApp from '@twind/next/app';
import { UserContextProvider } from 'lib/hooks/use-user';
import { AppProps } from 'next/app';
import '../public/fire.css';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <UserContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </UserProvider>
  );
}

export default withTwindApp(twindConfig, MyApp);

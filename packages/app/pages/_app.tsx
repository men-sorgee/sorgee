import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from 'components/layout/index';
import twindConfig from 'twind.config';
import withTwindApp from '@twind/next/app';
import { AppUserContextProvider } from 'lib/hooks/use-member';
import { AppProps } from 'next/app';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <AppUserContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppUserContextProvider>
      </UserProvider>
    </>
  );
}

export default withTwindApp(twindConfig, MyApp);

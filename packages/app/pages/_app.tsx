import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from 'components/layout/index';
import twindConfig from 'twind.config';
import withTwindApp from '@twind/next/app';
import { MemberContextProvider } from 'lib/hooks/use-member';
import { AppProps } from 'next/app';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <MemberContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MemberContextProvider>
      </UserProvider>
    </>
  );
}

export default withTwindApp(twindConfig, MyApp);

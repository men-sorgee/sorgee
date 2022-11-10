import { useEffect, useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { tw } from 'twind';
import Layout from 'components/layout';
import twindConfig from 'twind.config';
import withTwindApp from '@twind/next/app';
import { UserContextProvider } from 'lib/hooks/use-user';
import { getDirectusClient } from 'lib/services/directus-client';
import { Directus } from '@directus/sdk';
import { AppProps } from 'next/app';
import { DataSchema } from '../lib/directus/types'

function MyApp({ Component, pageProps }: AppProps) {
  const [directusClient, setDirectusClient] =  useState<Directus<DataSchema> | null>(null);
 
  useEffect(() => {
    getDirectusClient().then((client) => {
      setDirectusClient(client);
    });
  }, [directusClient, setDirectusClient]);

  return (
    <div className={tw`bg-black text-white`}>
      <UserProvider>
        <UserContextProvider directusClient={directusClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserContextProvider>
      </UserProvider>
    </div>
  );
}

export default withTwindApp(twindConfig, MyApp);

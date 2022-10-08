import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { tw } from 'twind';
import { AppProps } from 'next/app';

import withTwindApp from '@twind/next/app';
import { UserContextProvider } from 'lib/hooks/useUser';
import twindConfig from 'tailwind';
import { getDirectusClient } from 'lib/services/directus-client';
import Layout from '@/components/Layout';
import { Directus } from '@directus/sdk';
import { useState } from 'react';
import { DirectusModels } from '../types';

function MyApp({ Component, pageProps }: AppProps) {
  const [directusClient, setDirectusClient] =
    useState<Directus<DirectusModels> | null>(null);
  getDirectusClient().then((client) => {
    setDirectusClient(client);
  });
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

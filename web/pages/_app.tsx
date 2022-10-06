import { useEffect } from 'react';
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '@/components/Layout';
// import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { AppProps } from 'next/app';
import withTwindApp from '@twind/next/app';
import { UserContextProvider } from 'lib/hooks/useUser';
import twindConfig from 'tailwind';
import { tw } from 'twind';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    //document.body.classList?.remove('loading');
  }, []);

  return (
    <div className={tw`bg-black text-white`}>
      <UserProvider>
        <UserContextProvider supabaseClient={supabaseClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserContextProvider>
      </UserProvider>
    </div>
  );
}

export default withTwindApp(twindConfig, MyApp);

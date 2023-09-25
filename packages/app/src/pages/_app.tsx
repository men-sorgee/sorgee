import Layout from "layout";
import Providers from "layout/Providers";
import { AppProps } from "next/app";
import React from "react";

import WebVitals from "./_vitals";

export default function App({ Component, pageProps, router }: AppProps) {
  const Content = Component as any
  if (router?.asPath.startsWith('/code/')) {

    return <Content {...pageProps} />
  }

  return (
    <>
      <React.StrictMode>
        <Providers session={pageProps.session}>
          <Layout >
            <Content {...pageProps} />
          </Layout>
        </Providers>
      </React.StrictMode>

      <WebVitals />
    </>
  )
}

// export default dynamic(() => Promise.resolve(GNHApp), {
//   ssr: false,
// });


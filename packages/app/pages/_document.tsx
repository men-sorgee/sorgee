import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-theme="dark">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&family=Roboto+Slab:wght@500&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <body>
          <script
            key="gtag"
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-H0VWXREX1C"
          ></script>
          <script
            key="gtag-init"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H0VWXREX1C');`
            }}
          ></script>
          <Main />
          <NextScript />
          <Script
            defer
            src="https://app.termly.io/embed.min.js"
            data-auto-block="on"
            data-website-uuid="8fbb3f3c-9fc6-4256-ad1f-7c061dabb965"
          ></Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;

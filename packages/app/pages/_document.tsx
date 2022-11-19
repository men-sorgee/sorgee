import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Script
            type="text/javascript"
            src="https://app.termly.io/embed.min.js"
            data-auto-block="on"
            data-website-uuid="8fbb3f3c-9fc6-4256-ad1f-7c061dabb965"
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

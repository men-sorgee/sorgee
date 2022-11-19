import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { tw } from 'twind';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body
          className={tw`text-base font-sans min-h-full m-0 relative text-white bg-black antialiased`}
        >
          <Main />
          <NextScript />
        </body>
        
      </Html>
    );
  }
}

export default MyDocument;

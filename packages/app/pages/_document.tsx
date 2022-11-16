import Document, { Head, Html, Main, NextScript } from 'next/document';
import { tw } from 'twind';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body
          className={tw`text-base min-h-full m-0 relative text-white bg-black antialiased`}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body style={{ minWidth: '370px' }}>
          <Script
            id="termly"
            src="https://app.termly.io/embed.min.js"
            data-auto-block="on"
            data-website-uuid="8fbb3f3c-9fc6-4256-ad1f-7c061dabb965"
          />
          <Script id="gtag" src="https://www.googletagmanager.com/gtag/js?id=G-SJX78PVP26" />
          <Script
            id="gtag-init"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SJX78PVP26');`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

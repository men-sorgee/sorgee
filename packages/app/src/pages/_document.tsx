import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>

        </Head>
        <body
          style={{
            width: '100%',
            height: '100dvh',
            position: 'fixed',
            overflowY: 'hidden'
          }}
        >
          <Script
            id="termly"
            src="https://app.termly.io/embed.min.js"
            data-auto-block="on"
            data-website-uuid="8fbb3f3c-9fc6-4256-ad1f-7c061dabb965"
          />
          <Main />
          <NextScript />
          <Script
            id="termly-consent"
            src="https://app.termly.io/embed.min.js"
            data-auto-block="on"
            data-website-uuid="8fbb3f3c-9fc6-4256-ad1f-7c061dabb965"
          />
          <Script
            async
            id="bug-log"
            src="https://api.buglog.io/website/80W58ZYWE9/code"
            strategy="lazyOnload"
          />
          <Script
            id="cody-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.codySettings = { widget_id: 'f9b9899d-a39f-459e-a9e0-143daf7e8aa6' };
              !function(){var t=window,e=document,a=function(){var t=e.createElement("script");
              t.type="text/javascript",t.async=!0,t.src="https://trinketsofcody.com/cody-widget.js";
              var a=e.getElementsByTagName("script")[0];a.parentNode.insertBefore(t,a)};
              "complete"===document.readyState?a():t.attachEvent?t.attachEvent("onload",a):t.addEventListener("load",a,!1)}();`
            }}
          />
          <Script
            id="google-analytics-init"
            strategy="beforeInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-SJX78PVP26" />
          <Script
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SJX78PVP26', {
                page_path: window.location.pathname,
              });`
            }} />
        </body >
      </Html >
    )
  }
}

export default MyDocument

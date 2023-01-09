import Script from 'next/script'
import { useMeta } from 'hooks/use-meta'

export default function Terms() {
  const { setMeta } = useMeta()
  setMeta('Terms & Conditions')
  return (
    <>
      <div
        name="termly-embed"
        data-id="287910e8-202f-4cb6-b61f-4ce31f011de8"
        data-type="iframe"
      ></div>
      <Script
        strategy="lazyOnload"
        id="termly-jssdk"
        src="https://app.termly.io/embed-policy.min.js"
        type="text/javascript"
      />
    </>
  )
}

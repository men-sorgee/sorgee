import { useEffect } from 'react'

import { useMeta } from 'hooks/use-meta'
import Script from 'next/script'

import { Box } from '@chakra-ui/react'

export default function Privacy() {
  const { setMeta } = useMeta()
  useEffect(() => {
    setMeta('Cookie Policy')
  })
  return (
    <Box mt={10}>
      <div
        name={'termly-embed'}
        data-id="ae99ba16-765a-45c0-801d-d12de3a5ae93"
        data-type="iframe"
      ></div>

      <Script
        strategy="afterInteractive"
        id="termly-jssdk"
        src="https://app.termly.io/embed-policy.min.js"
        type="text/javascript"
      />
    </Box>
  )
}

import { useMeta } from "hooks/use-meta";
import Script from "next/script";
import { useEffect } from "react";

import { Box } from "@chakra-ui/react";

export default function Privacy() {
  const { setMeta } = useMeta()
  useEffect(() => {
    setMeta('Privacy Policy')
  })
  return (
    <Box mt={10}>
      <div
        name={'termly-embed'}
        data-id="f94e7630-c543-4da1-9ae7-e74267043d70"
        data-type="iframe"
      ></div>
      <Script
        id="termly-jssdk"
        src="https://app.termly.io/embed-policy.min.js"
        type="text/javascript"
      />
    </Box>
  )
}

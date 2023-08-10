import { useMeta } from "hooks/use-meta";
import Script from "next/script";
import { useEffect } from "react";

import { Box } from "@chakra-ui/react";

export default function Terms() {
  const { setMeta } = useMeta()
  useEffect(() => {
    setMeta('Terms & Conditions')
  })
  return (
    <Box mt={10}>
      <div
        name="termly-embed"
        data-id="287910e8-202f-4cb6-b61f-4ce31f011de8"
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

import { Markdown } from "components";
import { forwardRef } from "react";

import { Alert, AlertIcon, Box, HStack } from "@chakra-ui/react";

const Announcement = forwardRef<HTMLDivElement, {
  constrained: any,
  announcement: string
}>(({ constrained, announcement }, announcementRef) =>
  <Alert status="info">
    <HStack ref={announcementRef} {...constrained} alignItems="start">
      <AlertIcon />
      <Box flex="1">
        <Markdown content={announcement} m={0} />
      </Box>
    </HStack>
  </Alert>
)
Announcement.displayName = 'Announcement'

export default Announcement

import { ButtonLink, Page } from "components";

import { Heading, Text } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Page title="500" textAlign="center">
      <Heading>Server Error</Heading>
      <Text my={20}>This cannot be viewed at this time.</Text>
      <ButtonLink href="/">Go Home</ButtonLink>
    </Page>
  )
}

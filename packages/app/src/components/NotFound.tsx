import { useSession } from "next-auth/react";

import { Box, Heading, Text } from "@chakra-ui/react";

import { ButtonLink } from "./controls";

const NotFound = () => {
  const { status } = useSession()
  return (
    <Box mx={[4, 4, 0]}>
      <Heading as="h1" size="h1">
        Not Found
      </Heading>

      <Box>
        <Text>Check the URL and try again.</Text>
        <ButtonLink colorScheme="primary" href="/">
          Go Home
        </ButtonLink>
      </Box>
    </Box>
  )
}

export default NotFound

import { ButtonLink } from "components";
import { signIn } from "next-auth/react";

import { Box, Heading, Text } from "@chakra-ui/react";

export const AccessDenied = () => {
  return (
    <Box mx={[4, 4, 0]}>
      <Heading as="h1" size="h1">
        Please Authenticate
      </Heading>

      <Box>
        <Text>You must be signed in to view this page.</Text>
        <ButtonLink
          colorScheme="primary"
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
        >
          Sign in
        </ButtonLink>
      </Box>
    </Box>
  )
}

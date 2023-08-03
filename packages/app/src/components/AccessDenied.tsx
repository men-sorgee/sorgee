import { signIn, useSession } from "next-auth/react";

import { Box, Heading, Text } from "@chakra-ui/react";

import { ButtonLink } from "./controls";

const AccessDenied = () => {
  const { status } = useSession()
  return (
    <Box mx={[4, 4, 0]}>
      <Heading as="h1" size="h1">
        Please Authenticate
      </Heading>
      {status === 'authenticated' && (
        <Heading as="h2" size="h2">
          You do not have permission to view this page.
        </Heading>
      )}
      {status === 'unauthenticated' && (
        <Box>
          <Text>You must be signed in to view this page.</Text>
          <ButtonLink
            colorScheme="primary"
            href="/api/auth/signin"
            onClick={async (e) => {
              e.preventDefault()
              await signIn()
            }}
          >
            Sign in
          </ButtonLink>
        </Box>
      )}
    </Box>
  )
}

export default AccessDenied

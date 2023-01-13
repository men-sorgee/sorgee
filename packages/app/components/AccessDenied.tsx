import { signIn, useSession } from 'next-auth/react'
import { LinkButton } from './ui'
import { Box, Heading, Text } from '@chakra-ui/react'

const AccessDenied = () => {
  const { status } = useSession()
  return (
    <>
      <Heading as="h1">Please Authenticate</Heading>
      {status === 'authenticated' && (
        <Heading as="h2">You do not have permission to view this page.</Heading>
      )}
      {status === 'unauthenticated' && (
        <Box>
          <Text>You must be signed in to view this page.</Text>
          <LinkButton
            colorScheme="primary"
            href="/api/auth/signin"
            onClick={(e) => {
              e.preventDefault()
              signIn()
            }}
          >
            Sign in
          </LinkButton>
        </Box>
      )}
    </>
  )
}

export default AccessDenied

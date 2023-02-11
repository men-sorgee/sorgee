import { signIn, useSession } from 'next-auth/react'
import { LinkButton } from './controls'
import { Box, Heading, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
const AccessDenied = () => {
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      setTimeout(() => {
        signIn()
      }, 1000)
    }
  })
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
            onClick={async (e) => {
              e.preventDefault()
              await signIn()
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

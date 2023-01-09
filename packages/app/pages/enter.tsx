import type { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { Button, Text, Heading } from '@chakra-ui/react'
import Page from '../components/Page'

const Enter: NextPage = () => {
  return (
    <Page title="Welcome">
      <Heading size="lg">
        Access to this site is restricted to members of the community and those that they invite.
      </Heading>
      <Text size="lg">New users must register with the email address in your invite.</Text>
      <Text size="lg">
        Not sure if you were invited? Try signing in -- if it works you were part of our initial
        list.
      </Text>

      <Button
        color="accent"
        mt={4}
        onClick={(e) => {
          e.preventDefault()
          signIn(null, { callbackUrl: '/apply/resume' })
        }}
      >
        Sign In / Sign Up
      </Button>
    </Page>
  )
}

export default Enter

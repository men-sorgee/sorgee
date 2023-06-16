import { Page } from 'components'
import { useUser } from 'hooks'

import { Button, HStack, Spacer } from '@chakra-ui/react'

import { Plans } from 'components'

type Params = {}

const Pricing = ({}: Params) => {
  const { member, loading } = useUser()

  return (
    <Page
      loading={loading}
      title="Account"
      description="Add features to your experience"
      requireAuth
    >
      <Plans allowSubscribe />
      <HStack mt={14} hidden>
        <Button
          size="lg"
          type="submit"
          bg="secondary.500"
          color="white"
          bottom={4}
          _hover={{ bg: 'accent.500' }}
        >
          Update Email
        </Button>
        <Spacer />

        <Button
          size="lg"
          type="submit"
          bg="secondary.300"
          color="white"
          bottom={4}
          _hover={{ bg: 'red.500' }}
        >
          Cancel Subscription
        </Button>
        <Button
          size="lg"
          type="submit"
          bg="secondary.500"
          color="white"
          bottom={4}
          _hover={{ bg: 'red.500' }}
        >
          Delete Account
        </Button>
      </HStack>
    </Page>
  )
}

export default Pricing

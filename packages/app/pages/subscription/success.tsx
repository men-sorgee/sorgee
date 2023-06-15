import { Page } from 'components'

import { Text } from '@chakra-ui/react'

export default function SuccessfulPage() {
  return (
    <Page title="Payment Successful">
      <Text fontSize="2xl" align="center">
        Your subscription is now in effect.
      </Text>
    </Page>
  )
}

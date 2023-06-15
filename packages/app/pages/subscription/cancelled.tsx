import { Page } from 'components'

import { Text } from '@chakra-ui/react'

export default function CancelledPage() {
  return (
    <Page title="Payment Cancelled">
      <Text fontSize="2xl" align="center">
        You successfully cancelled.
      </Text>
    </Page>
  )
}

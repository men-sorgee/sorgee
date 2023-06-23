import { Page, Plans } from 'components'
import { useUser } from 'hooks'
import Script from 'next/script'

import { Text } from '@chakra-ui/react'

export default function PricingPage() {
  const { member, loading } = useUser({ redirectsEnabled: true })
  return (
    <>
      <Page
        loading={loading}
        title="Pricing"
        description="Add features to your experience"
      >
        <Text fontSize="lg" align="center" mb={4} mx={[0, 20, 40, 60]}>
          Approved and verified members always get event invites for free.
          Additional features are available for a small recurring fee.
        </Text>
        <Text fontSize="xl" align="center" mb={4} mx={[0, 20, 40, 60]}>
          Select your plan from the options below:
        </Text>
        <Plans />
      </Page>
    </>
  )
}

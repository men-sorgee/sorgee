import { Page } from 'components'
import { useUser } from 'hooks'
import Script from 'next/script'

import { Text } from '@chakra-ui/react'

export default function SubscribePage() {
  const { member, loading } = useUser({ redirectsEnabled: true })
  return (
    <>
      <Script async src="https://js.stripe.com/v3/pricing-table.js" />
      <Page
        loading={loading}
        title="Subscribe"
        description="Add features to your experience"
        requireAuth
      >
        <Text fontSize="lg" align="center" mb={4} mx={[0, 20, 40, 60]}>
          Approved and verified members always get event invites for free.
          Additional features are available for a small recurring fee.
        </Text>
        <Text fontSize="xl" align="center" mb={4} mx={[0, 20, 40, 60]}>
          Select your plan from the options below:
        </Text>
        <stripe-pricing-table
          pricing-table-id="prctbl_1NFMnREoEUGL2BgulhFG0mBz"
          publishable-key="pk_live_51LoPw1EoEUGL2Bgubxo5vTjGRx0ONP4JHo6A0zVJivv7ToiCBoRnKdmRoCIWFbikTTenBSQZ7xy8wmF0woyx4NBH00MykU8UsN"
          customer-email={member?.email}
          customer-name={member?.first_name + ' ' + member?.last_name}
          customer-phone={member?.phone}
          client-reference-id={member?.id}
        ></stripe-pricing-table>
      </Page>
    </>
  )
}

import { Page } from 'components'
import { Plans } from 'components'
import { useRouter } from 'next/router'
import { MembershipType } from 'lib/models'

type Params = {}

export default function AccountSubscriptionPage({}: Params) {
  const router = useRouter()
  const { plan: p } = router.query
  let plan = undefined
  if (p) {
    plan = Number(p) as MembershipType
  }

  return (
    <Page title="Subscription" requireAuth>
      <Plans allowSubscribe highlightedPlan={plan} />
    </Page>
  )
}

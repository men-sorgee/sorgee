import { Page, Plans } from "components";
import { MembershipType } from "lib/models";
import { useRouter } from "next/router";

type Params = {}

export default function AccountSubscriptionPage({}: Params) {
  const router = useRouter()
  const { plan: p = MembershipType.plus } = router.query
  let plan = undefined
  if (p) {
    plan = Number(p) as MembershipType
  }

  return (
    <Page title="Choose a Subscription">
      <Plans allowSubscribe highlightedPlan={plan} />
    </Page>
  )
}

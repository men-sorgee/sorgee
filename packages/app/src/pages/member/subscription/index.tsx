import { Page, Plans } from "components";
import { MembershipType } from "lib/models";
import { useRouter } from "next/router";
import { event } from "nextjs-google-analytics";
import { useEffect, useState } from "react";

type Params = {}

export default function AccountSubscriptionPage({ }: Params) {
  const [captured, setCaptured] = useState(false)
  const router = useRouter()
  const { plan: p = MembershipType.plus, cancelled: c, product: pr } = router.query
  const product_id = pr ? String(pr) : undefined
  const cancelled = Boolean(c || 0)
  let plan = undefined
  if (p) {
    plan = Number(p) as MembershipType
  }

  useEffect(() => {
    if (cancelled && !captured && product_id) {
      event('plans_purchase_cancelled', {
        category: 'monetization',
        product: product_id,
      })
      setCaptured(true)
    }
  }, [router, cancelled, product_id, captured])

  return (
    <Page title="Choose a Subscription">
      <Plans allowSubscribe highlightedPlan={plan} />
    </Page>
  )
}

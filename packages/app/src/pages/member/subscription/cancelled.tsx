import { Page, Plans } from "components";
import { useProducts, useUser } from "hooks";
import { MembershipRenewalType, MembershipType } from "lib/models";
import { logEvent } from "lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SubscriptionCancelledPage() {
  const [item, setItem] = useState<{
    plan: MembershipType
    interval: MembershipRenewalType
    product_id: string
  }>(null)
  const router = useRouter()
  const { products, loading: productsLoading } = useProducts()
  const { member, loading } = useUser()
  const { price: price_id } = router.query

  useEffect(() => {
    if (!loading && !productsLoading && products && price_id) {
      const product = products.find((p) => p.prices.find(price => price.id == String(price_id)))
      const price = product.prices.find(i => i.id == String(price_id))
      if (!price) return
      setItem({
        plan: MembershipType[product.type],
        interval: price.interval,
        product_id: product.id
      })
    }
  }, [loading, productsLoading, products, price_id, item?.interval])

  useEffect(() => {
    if (
      !loading &&
      !productsLoading &&
      products &&
      member?.id &&
      item

    ) {
      logEvent('plans_purchase_cancelled', {
        category: 'monetization',
        plan: MembershipType[item.plan],
        product: item.product_id,
        userId: member.id
      })
      setTimeout(async () => {
        await router.push('/member/subscription')
      }, 5000)
    }
  }, [member, loading, router, productsLoading, products, item])

  return (
    <Page title="Subscription" loading={loading}>
      <Plans allowSubscribe={true} />
    </Page>
  )
}

import { Page, Plan } from "components";
import { useProducts, useUser } from "hooks";
import {
  MembershipNames,
  MembershipRenewalType,
  MembershipType
} from "lib/models";
import { useRouter } from "next/router";
import { event } from "nextjs-google-analytics";
import { useEffect, useState } from "react";

import { Text } from "@chakra-ui/react";

export default function SubscriptionSuccessPage() {
  const [item, setItem] = useState<{
    plan: MembershipNames
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
      event('plans_purchase_cancelled', {
        category: 'monetization',
        plan: MembershipType[product.type],
        product: product.id,
        userId: member.id
      })
      setItem({
        plan: product.type,
        interval: price.interval,
        product_id: product.id
      })
      setTimeout(async () => {
        await router.push('/member/subscription')
      }, 1000)
    }
  }, [loading, productsLoading, products, price_id, item?.interval, member?.id, router])



  return (
    <Page title="Subscription Success" loading={loading}>
      <Text>
        Thanks for contributing with your membership subscription. This money
        will go to help paying for the servers needed for you horny fuckers.
      </Text>
      <Plan plan={item?.plan} interval={item?.interval} />
    </Page>
  )
}

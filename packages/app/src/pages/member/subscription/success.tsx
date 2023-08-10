import { Page, Plan } from "components";
import { useProducts, useStripeSession, useUser } from "hooks";
import { MembershipType, ProductView } from "lib/models";
import { useRouter } from "next/router";
import { event } from "nextjs-google-analytics";
import { useEffect, useState } from "react";

import { Heading, Text } from "@chakra-ui/react";

export default function SubscriptionSuccessPage() {
  const [product, setProduct] = useState<ProductView>(null)
  const router = useRouter()
  const { products, loading: productsLoading } = useProducts()
  const { member, loading } = useUser()
  const { product: productId } = router.query

  useEffect(() => {
    if (!loading && !productsLoading && products && productId) {
      const subscription = products.find((p) => p.id == String(productId))
      if (!subscription) return
      setProduct(subscription)
    }
  }, [loading, productsLoading, products, productId])

  useEffect(() => {
    if (
      !loading &&
      !productsLoading &&
      products &&
      member?.id &&
      productId &&
      product
    ) {
      event('purchase', {
        category: 'monetization',
        plan: MembershipType[product.type],
        productId,
        userId: member.id,
        value: product.prices[member?.renewal_type || 'monthly'],
        currency: product.currency
      })
      setTimeout(async () => {
        await router.push('/member/account/plan')
      }, 5000)
    }
  }, [member, loading, productId, router, productsLoading, products, product])

  return (
    <Page title="Subscription Success" loading={loading}>
      <Text>
        Thanks for contributing with your membership subscription. This money
        will go to help paying for the servers needed for all you horny fuckers.
      </Text>
    </Page>
  )
}

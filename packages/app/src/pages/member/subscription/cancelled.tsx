import { Page, Plan } from "components";
import { useProducts, useStripeSession, useUser } from "hooks";
import { MembershipType, ProductView } from "lib/models";
import { useRouter } from "next/router";
import { event } from "nextjs-google-analytics";
import { use, useEffect, useState } from "react";

import { Heading, Text } from "@chakra-ui/react";

export default function SubscriptionCancelledPage() {
  const [product, setProduct] = useState<ProductView>(null)
  const router = useRouter()
  const { products, loading: productsLoading } = useProducts()
  const { member, loading } = useUser()
  const { product: productId } = router.query

  useEffect(() => {
    if (!loading && !productsLoading && products && productId) {
      const p = products.find((p) => p.id == String(productId))
      if (!p) return
      setProduct(p)
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
      event('plans_purchase_cancelled', {
        category: 'monetization',
        plan: MembershipType[product.type],
        productId,
        userId: member.id
      })
      setTimeout(async () => {
        await router.push('/member/subscription')
      }, 1000)
    }
  }, [member, loading, productId, router, productsLoading, products, product])

  return (
    <Page title="Subscription" loading={loading}>
      <Text fontSize="xl" textAlign="center">
        Your purchase was cancelled.
      </Text>
    </Page>
  )
}

import { use, useEffect, useState } from 'react'
import { event } from 'nextjs-google-analytics'
import { Page, Plan } from 'components'
import { Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useUser, useProducts, useStripeSession } from 'hooks'
import { MembershipType, ProductView } from 'lib/models'

export default function SubscriptionCancelledPage() {
  const [product, setProduct] = useState<ProductView>(null)
  const router = useRouter()
  const { products, loading: productsLoading } = useProducts()
  const { member, loading } = useUser()
  const { product: productId, session: sessionId } = router.query

  const { session, loading: sessionLoading } = useStripeSession(
    sessionId as string
  )

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
      !sessionLoading &&
      products &&
      member?.id &&
      productId &&
      product
    ) {
      event('plans_purchase_cancelled', {
        category: 'monetization',
        plan: MembershipType[product.type],
        productId,
        userId: member.id,
        sessionId
      })
      setTimeout(async () => {
        await router.push('/member/account')
      }, 1000)
    }
  }, [
    member,
    loading,
    productId,
    router,
    productsLoading,
    products,
    session?.amount_total,
    session?.currency,
    sessionId,
    sessionLoading,
    product
  ])

  return (
    <Page title="Subscription Cancelled" requireAuth loading={loading}>
      <Text>Your membership subscription purchase was cancelled.</Text>
      {member && (
        <>
          <Heading>Your Plan</Heading>
          <Plan plan={member.membership_type} interval={member.renewal_type} />
        </>
      )}
    </Page>
  )
}

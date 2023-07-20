import { useEffect, useState } from 'react'
import { event } from 'nextjs-google-analytics'
import { Page, Plan } from 'components'
import { Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useUser, useProducts, useStripeSession } from 'hooks'
import { MembershipType, ProductView } from 'lib/models'

export default function SubscriptionSuccessPage() {
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
      const subscription = products.find((p) => p.id == String(productId))
      if (!subscription) return
      setProduct(subscription)
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
      event('purchase', {
        category: 'monetization',
        plan: MembershipType[product.type],
        productId,
        userId: member.id,
        value: session.amount_total,
        currency: session.currency,
        sessionId
      })
      setTimeout(async () => {
        await router.push('/member/account')
      }, 5000)
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
    <Page title="Subscription Success" requireAuth loading={loading}>
      <Text>
        Thanks for contributing with your membership subscription. This money
        will go to help paying for the servers needed for all you horny fuckers.
      </Text>
    </Page>
  )
}

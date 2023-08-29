import { sentenceCase } from "change-case";
import { ButtonBusy, ButtonLink, Loading } from "components";
import { useProducts, useUser } from "hooks";
import {
  memberFeatures,
  MemberLevel,
  MembershipType,
  PriceView,
  ProductView
} from "lib/models";
import { getJSON } from "lib/utils";
import { event } from "nextjs-google-analytics";
import { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Spacer,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Params = {
  allowSubscribe?: boolean
  highlightedPlan?: MembershipType
}

export const Plans = ({
  allowSubscribe = false,
  highlightedPlan = MembershipType.plus,
}: Params) => {
  const { products, loading: productsLoading } = useProducts()
  const { member, loading, authenticated, level } = useUser({
    redirectsEnabled: false,
  })
  const [interval, setInterval] = useState('month')

  useEffect(() => {
    if (!loading && !productsLoading && products && member) {
      event('session_start', {
        category: 'monetization',
        userId: member?.id,
      })

      if (highlightedPlan) {
        event('view_item', {
          category: 'monetization',
          productId: products.find((p) => p.type == MembershipType[highlightedPlan])?.id,
          userId: member?.id,
        })
      }
    }
  }, [highlightedPlan, loading, member, products, productsLoading])

  const bgColor = useColorModeValue('secondary.500', 'gray.700')

  const processSubscription = async (product: ProductView, priceId: string) => {
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
    const { data, error, success } = await getJSON<{
      id: string
      amount: number
    }>(`/api/stripe/subscriptions/${priceId}`)
    if (!success) {
      console.error(error)
      return
    }
    event('add_to_cart', {
      category: 'monetization',
      plan: MembershipType[product?.type || 'none'],
      productId: product.id,
      userId: member?.id,
      value: data?.amount,
      currency: 'usd',
      sessionId: data?.id,
    })

    event('begin_checkout', {
      category: 'monetization',
      plan: MembershipType[product.type],
      productId: product.id,
      userId: member?.id,
      value: data.amount,
      currency: 'usd',
      sessionId: data.id,
    })

    await stripe
      .redirectToCheckout({
        sessionId: data.id,
      })
      .catch(console.error)
  }

  const showSubscribeButton =
    !!member && member.membership_type == 'none' && level == MemberLevel.brother
  const showNoButton = level < MemberLevel.brother
  const showManageSubscriptionButton = !!member && member.membership_type != 'none'

  const showButtons = allowSubscribe && authenticated && !loading

  const shouldHighlight = (plan: ProductView) => {
    if (highlightedPlan) {
      return plan.type == MembershipType[highlightedPlan]
    } else {
      return !!plan.label
    }
  }

  const getPrice = (prices: PriceView[], interval: string) => {
    let price = prices.find((p) => p.interval == interval)
    return price
  }

  if (loading || productsLoading) {
    return <Loading />
  }
  return (
    <>
      <Flex
        w="full"
        mx="auto"
        pb="4"
        justify={['center', 'center', 'space-around']}
        direction={['column', 'column', 'row']}
        gap={[2, 3, 4]}
      >
        {products &&
          products.map((product: ProductView) => (
            <VStack
              key={product.id}
              w={['full', 'full', 'fit']}
              rounded="md"
              shadow={'lg'}
              border={shouldHighlight(product) ? '3px solid' : '1px dashed'}
              borderColor={shouldHighlight(product) ? 'accent.500' : 'text'}
              px={[4, 4, 6]}
              gap={2}
              justify="space-between"
              py={4}
            >
              <Box h={5} position="relative">
                {(shouldHighlight(product) && (
                  <Badge
                    variant="solid"
                    bg="accent.500"
                    size="xl"
                    rounded="md"
                    m={0}
                    position="static"
                    mx="auto"
                  >
                    {'Recommended'}
                  </Badge>
                )) || product.label != undefined && (
                  <Badge
                    variant="solid"
                    bg="primary.500"
                    size="xl"
                    rounded="md"
                    m={0}
                    position="static"
                    mx="auto"
                  >
                    {product.label}
                  </Badge>
                ) || <span>&nbsp;</span>}
              </Box>
              <VStack>
                <Heading as="h2" fontSize="3xl" mt={0} noOfLines={1}>
                  {product.name}
                </Heading>

                <Heading as="h3">
                  ${getPrice(product.prices, interval)?.amount} / {interval == 'month' ? 'mo' : 'yr'}
                </Heading>
              </VStack>
              <Text m={0} p={0}>
                {product.description}
              </Text>

              <VStack gap={1} justify="space-between" align="start">
                {memberFeatures.map((feature) => (
                  <Flex key={feature} justify="evenly" w="full" align="center">
                    <CheckCircleIcon
                      width="20px"
                      color={product.features.includes(feature) ? 'green' : 'gray'}
                    />
                    <Text textAlign="left" p={0} mx={2} textTransform={'capitalize'}>
                      {sentenceCase(feature, {
                        stripRegexp: /[^A-Za-z0-9\s]/g,
                      })}
                    </Text>
                  </Flex>
                ))}
              </VStack>
              <Spacer />
              {showButtons && (
                <Box>
                  {showSubscribeButton && (
                    <ButtonBusy
                      onClick={() => processSubscription(product, getPrice(product.prices, interval)?.id)}
                    >
                      Subscribe
                    </ButtonBusy>
                  )}
                  {showNoButton && (
                    <Button disabled cursor="not-allowed">
                      Brothers Only
                    </Button>
                  )}

                  {showManageSubscriptionButton && member.membership_type != product.type && (
                    <ButtonLink
                      href="/api/stripe/portal"
                      variant="solid"
                      bg="primary.500"
                      color="white"
                      _hover={{ bg: 'accent.600' }}
                    >
                      Switch to {product.name}
                    </ButtonLink>
                  )}
                  {showManageSubscriptionButton && member.membership_type == product.type && (
                    <Button
                      disabled
                      cursor="default"
                      variant="solid"
                      bg="secondary.500"
                      _hover={{ bg: 'secondary.500' }}
                      px={4}
                      py={2}
                    >
                      Current Plan
                    </Button>
                  )}
                </Box>
              )}
            </VStack>
          ))}
      </Flex>
      <Text fontSize="xs" align="center" mb={4} mx={[0, 20]}>
        * Approved and verified members always get event invites for free. Additional features are
        available for a small recurring fee.
      </Text>
      <Box textAlign="center" mt={2}>
        <RadioGroup
          mx="auto"
          rounded="full"
          color="white"
          bg={bgColor}
          py={0}
          px={4}
          gap={4}
          display="inline-block"
          defaultValue={interval}
        >
          <Radio value="month" onChange={() => setInterval('month')} p={4}>
            Monthly
          </Radio>
          <Radio value="year" onChange={() => setInterval('year')} p={4}>
            Yearly
          </Radio>
        </RadioGroup>
      </Box>
    </>
  )
}

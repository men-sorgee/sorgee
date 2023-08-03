import { sentenceCase } from "change-case";
import { ButtonLink } from "components";
import { useProducts, useUser } from "hooks";
import { baseUrl } from "lib/config";
import {
  memberFeatures,
  MemberLevel,
  MembershipType,
  ProductView
} from "lib/models";
import { getJSON } from "lib/utils";
import { event } from "nextjs-google-analytics";
import { use, useEffect, useState } from "react";

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

const Plans = ({
  allowSubscribe = false,
  highlightedPlan = MembershipType.plus
}: Params) => {
  const { products, loading: productsLoading } = useProducts()
  const { member, loading, authenticated, level } = useUser({
    redirectsEnabled: false
  })
  const [interval, setInterval] = useState('month')

  useEffect(() => {
    if (!loading && !productsLoading && products && member) {
      event('session_start', {
        category: 'monetization',
        userId: member?.id
      })

      if (highlightedPlan) {
        event('view_item', {
          category: 'monetization',
          productId: products.find(
            (p) => p.type == MembershipType[highlightedPlan]
          )?.id,
          userId: member?.id
        })
      }
    }
  }, [highlightedPlan, loading, member, products, productsLoading])

  const bgColor = useColorModeValue('secondary.500', 'gray.700')

  const processSubscription = async (productId: string) => {
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(
      process.env.STRIPE_PUBLIC_KEY ||
        'pk_live_51LoPw1EoEUGL2Bgubxo5vTjGRx0ONP4JHo6A0zVJivv7ToiCBoRnKdmRoCIWFbikTTenBSQZ7xy8wmF0woyx4NBH00MykU8UsN'
    )
    const { data, error, success } = await getJSON<{
      id: string
      amount: number
    }>(`/api/stripe/subscribe/${productId}`)
    if (!success) {
      console.error(error)
      return
    }
    const subscription = products.find((p) => p.id == productId)
    event('add_to_cart', {
      category: 'monetization',
      plan: MembershipType[subscription?.type || 'none'],
      productId,
      userId: member?.id,
      value: data?.amount,
      currency: 'usd',
      sessionId: data?.id
    })

    event('begin_checkout', {
      category: 'monetization',
      plan: MembershipType[subscription.type],
      productId,
      userId: member?.id,
      value: data.amount,
      currency: 'usd',
      sessionId: data.id
    })

    await stripe
      .redirectToCheckout({
        sessionId: data.id
      })
      .catch(console.error)
  }

  const showSubscribeButton =
    !!member && member.membership_type == 'none' && level == MemberLevel.brother
  const showNoButton = level < MemberLevel.brother
  const showManageSubscriptionButton =
    !!member && member.membership_type != 'none'

  const showButtons = allowSubscribe && authenticated && !loading

  const shouldHighlight = (plan: ProductView) => {
    if (highlightedPlan) {
      return plan.type == MembershipType[highlightedPlan]
    } else {
      return !!plan.label
    }
  }

  if (loading || productsLoading) {
    return <></>
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
              shadow={'dark-lg'}
              border={shouldHighlight(product) ? '3px solid' : ''}
              borderColor={'accent.500'}
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
                    {product.label || 'Recommended'}
                  </Badge>
                )) || <span>&nbsp;</span>}
              </Box>
              <VStack>
                <Heading as="h2" fontSize="3xl" mt={0}>
                  {product.name}
                </Heading>

                <Heading as="h3">
                  ${product.prices[interval] / 100} /{' '}
                  {interval == 'month' ? 'mo' : 'yr'}
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
                      color={
                        product.features.includes(feature) ? 'green' : 'gray'
                      }
                    />
                    <Text
                      textAlign="left"
                      p={0}
                      mx={2}
                      textTransform={'capitalize'}
                    >
                      {sentenceCase(feature, {
                        stripRegexp: /[^A-Za-z0-9\s]/g
                      })}
                    </Text>
                  </Flex>
                ))}
              </VStack>
              <Spacer />
              {showButtons && (
                <Box>
                  {showSubscribeButton && (
                    <Button
                      onClick={() => processSubscription(product.id)}
                      variant="solid"
                      bg="primary.500"
                      color="white"
                      _hover={{ bg: 'accent.600' }}
                    >
                      Subscribe
                    </Button>
                  )}
                  {showNoButton && (
                    <Button disabled cursor="not-allowed">
                      Brothers Only
                    </Button>
                  )}

                  {showManageSubscriptionButton &&
                    member.membership_type != product.type && (
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
                  {showManageSubscriptionButton &&
                    member.membership_type == product.type && (
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
        * Approved and verified members always get event invites for free.
        Additional features are available for a small recurring fee.
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

export default Plans

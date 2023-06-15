import { useState } from 'react'

import axios from 'axios'
import { sentenceCase } from 'change-case'
import { ButtonLink, Page } from 'components'
import { useUser } from 'hooks'
import { memberFeatures, MemberLevel, ProductView } from 'lib/models'
import { subscriptionData } from 'lib/services/stripe/client'

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Spacer,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { loadStripe } from '@stripe/stripe-js'

export const getServerSideProps = async () => {
  const { getClient } = await import('lib/services/stripe/server')
  const stripe = getClient()

  const { data: prices } = await stripe.prices.list()

  const plans = await Promise.all(
    prices
      .filter((p) => p.active)
      .map(async (price) => {
        const product = await stripe.products.retrieve(price.product as string)
        return {
          id: price.id,
          name: product.name,
          description: product.description,
          price: price.unit_amount,
          interval: price.recurring.interval,
          currency: price.currency,
          ...subscriptionData[product.id]
        }
      })
  )

  const sortedPlans = plans.sort((a, b) => a.price - b.price)

  const products: { [key: string]: ProductView } = sortedPlans.reduce(
    (acc, { name, price, interval, ...details }) => {
      if (!acc[name]) {
        acc[name] = {
          name,
          prices: {},
          ...details
        }
      }

      acc[name].prices[interval] = price
      return acc
    },
    {}
  )

  return {
    props: {
      products: Object.values(products)
    }
  }
}

type Params = {
  products: ProductView[]
}

const Pricing = ({ products }: Params) => {
  const { member, loading, authenticated, level } = useUser()
  const [interval, setInterval] = useState('month')

  const bgColor = useColorModeValue('primary.500', 'gray.700')

  const processSubscription = (planId: string) => async () => {
    const { data } = await axios.get(`/api/stripe/subscription/${planId}`)
    const stripe = await loadStripe(
      process.env.STRIPE_PUBLIC_KEY ||
        'pk_live_51LoPw1EoEUGL2Bgubxo5vTjGRx0ONP4JHo6A0zVJivv7ToiCBoRnKdmRoCIWFbikTTenBSQZ7xy8wmF0woyx4NBH00MykU8UsN'
    )
    await stripe.redirectToCheckout({ sessionId: data.id })
  }

  const showSubscribeButton =
    !!member && member.membership_type == 'none' && level == MemberLevel.brother
  const showManageSubscriptionButton =
    !!member && member.membership_type != 'none'

  return (
    <Page
      loading={loading}
      title="Account"
      description="Add features to your experience"
      requireAuth
    >
      <Box textAlign="center" mt={-10}>
        <RadioGroup
          mx="auto"
          rounded="full"
          color="white"
          bg={bgColor}
          py={3}
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
      <Flex
        w="full"
        mx="auto"
        py="4"
        justify={['center', 'center', 'space-around']}
        direction={['column', 'column', 'row']}
        gap={[2, 3, 4]}
      >
        {products.map((plan: ProductView) => (
          <VStack
            key={plan.id}
            w={['full', 'full', 'fit']}
            rounded="md"
            shadow={'dark-lg'}
            border={plan.label ? '3px solid' : ''}
            borderColor={'accent.500'}
            px={[4, 4, 6]}
            gap={2}
            justify="space-between"
            py={4}
          >
            <Box h={4}>
              {plan.label && (
                <Badge variant="solid" bg="accent.500" size="xl" rounded="md">
                  {plan.label}
                </Badge>
              )}
            </Box>
            <VStack>
              <Heading as="h2" fontSize="3xl" mt={0}>
                {plan.name}
              </Heading>

              <Heading as="h3">
                ${plan.prices[interval] / 100} / {interval}
              </Heading>
            </VStack>
            <Text m={0} p={0}>
              {plan.description}
            </Text>

            <VStack>
              {memberFeatures.map((feature) => (
                <Flex key={feature} justify="evenly" w="full" align="center">
                  <CheckCircleIcon
                    width="20px"
                    color={plan.features.includes(feature) ? 'green' : 'gray'}
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

            {!loading && authenticated && (
              <Box>
                {showSubscribeButton && (
                  <Button
                    onClick={processSubscription(plan.id)}
                    variant="solid"
                    bg="primary.500"
                    color="white"
                    _hover={{ bg: 'accent.600' }}
                  >
                    Subscribe
                  </Button>
                )}
                {showManageSubscriptionButton &&
                  member.membership_type != plan.type && (
                    <ButtonLink
                      href="/api/stripe/portal"
                      variant="solid"
                      bg="primary.500"
                      color="white"
                      _hover={{ bg: 'accent.600' }}
                    >
                      Update Subscription
                    </ButtonLink>
                  )}
                {showManageSubscriptionButton &&
                  member.membership_type == plan.type && (
                    <Badge
                      variant="solid"
                      bg="secondary.500"
                      size="xl"
                      rounded="md"
                      px={4}
                      py={2}
                    >
                      Current Plan
                    </Badge>
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

      <HStack mt={14}>
        <Button
          size="lg"
          type="submit"
          bg="secondary.500"
          color="white"
          bottom={4}
          _hover={{ bg: 'accent.500' }}
        >
          Update Email
        </Button>
        <Spacer />

        <Button
          size="lg"
          type="submit"
          bg="secondary.300"
          color="white"
          bottom={4}
          _hover={{ bg: 'red.500' }}
        >
          Cancel Subscription
        </Button>
        <Button
          size="lg"
          type="submit"
          bg="secondary.500"
          color="white"
          bottom={4}
          _hover={{ bg: 'red.500' }}
        >
          Delete Account
        </Button>
      </HStack>
    </Page>
  )
}

export default Pricing

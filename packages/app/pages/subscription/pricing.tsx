import { useState } from 'react'

import axios from 'axios'
import { sentenceCase } from 'change-case'
import { ButtonLink, Page } from 'components'
import { useUser } from 'hooks'
import { memberFeatures, MembershipType } from 'lib/models'
import { getClient, subscriptionData } from 'lib/services/stripe/server'
import { useRouter } from 'next/router'

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { loadStripe } from '@stripe/stripe-js'

type ProductView = {
  id: string
  name: string
  description: string
  prices: {
    [key: string]: number
  }
  currency: string
  features: string[]
  type: MembershipType
  label?: string
}

export const getStaticProps = async () => {
  const stripe = getClient()

  const { data: prices } = await stripe.prices.list()

  const plans = await Promise.all(
    prices
      .filter((p) => p.active)
      .map(async (price) => {
        const product = await stripe.products.retrieve(
          price.product.toString(),
          {
            expand: ['price.product']
          }
        )
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

  const products = sortedPlans.reduce(
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
  const { member, loading, authenticated } = useUser()
  const [interval, setInterval] = useState('month')

  const bgColor = useColorModeValue('primary.500', 'gray.700')

  const processSubscription = (planId: any) => async () => {
    const { data } = await axios.get(`/api/stripe/subscription/${planId}`)
    const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY)
    await stripe.redirectToCheckout({ sessionId: data.id })
  }

  const showSubscribeButton = !!member && Number(member.membership_type) == 0
  const showManageSubscriptionButton =
    !!member && Number(member.membership_type) > 0

  const router = useRouter()
  return (
    <Page
      loading={loading}
      title="Subscribe"
      description="Add features to your experience"
      requireAuth
    >
      <Text fontSize="lg" align="center" mb={4} mx={[0, 20, 40, 60]}>
        Approved and verified members always get event invites for free.
        Additional features are available for a small recurring fee.
      </Text>
      <Text fontSize="xl" align="center" mb={4} mx={[0, 20, 40, 60]}>
        Select your plan from the options below:
      </Text>
      <Box pt={8} textAlign="center">
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
        maxW={['xl', '2xl', '4xl']}
        mx="auto"
        py="16"
        px={2}
        justify={['center', 'center', 'space-around']}
        direction={['column', 'column', 'row']}
        gap={[2, 3, 4]}
      >
        {products.map((plan: ProductView) => (
          <VStack
            key={plan.id}
            w={['full', 'full', 80]}
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
                {showManageSubscriptionButton && (
                  <ButtonLink
                    href="/api/stripe/portal"
                    variant="solid"
                    bg="primary.500"
                    color="white"
                    _hover={{ bg: 'accent.600' }}
                  >
                    Manage Subscription
                  </ButtonLink>
                )}
              </Box>
            )}
          </VStack>
        ))}
      </Flex>
    </Page>
  )
}

export default Pricing

import { useState } from 'react'
import Script from 'next/script'
import axios from 'axios'
import { sentenceCase } from 'change-case'
import { ButtonLink } from 'components'
import { useUser } from 'hooks'
import { memberFeatures, MemberLevel, ProductView } from 'lib/models'

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

import { useProducts } from 'hooks'
import { getJSON } from '../lib/utils'
type Params = {
  allowSubscribe?: boolean
}

const Plans = ({ allowSubscribe = false }: Params) => {
  const { products, loading: productsLoading } = useProducts()
  const { member, loading, authenticated, level } = useUser()
  const [interval, setInterval] = useState('month')

  const bgColor = useColorModeValue('primary.500', 'gray.700')

  const processSubscription = async (planId: string) => {
    const { loadStripe } = await import('@stripe/stripe-js')
    const { data, error, success } = await getJSON<{ id: string }>(
      `/api/stripe/purchase/${planId}`
    )
    if (!success) {
      console.error(error)
      return
    }
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

  const showButtons = allowSubscribe && authenticated && !loading

  if (loading || productsLoading) {
    return <></>
  }
  return (
    <>
      <Box textAlign="center" mt={2}>
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
        {products &&
          products.map((plan: ProductView) => (
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

              {showButtons && (
                <Box>
                  {showSubscribeButton && (
                    <Button
                      onClick={() => processSubscription(plan.id)}
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
    </>
  )
}

export default Plans

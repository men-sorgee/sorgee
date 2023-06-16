import { useState } from 'react'

import axios from 'axios'
import { sentenceCase } from 'change-case'
import { ButtonLink, Page } from 'components'
import { useUser } from 'hooks'
import { memberFeatures, MemberLevel, ProductView } from '@lib/models'
import { subscriptionData } from '@lib/services/stripe/client'

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
import { Plans } from 'components'

type Params = {}

const Pricing = ({}: Params) => {
  const { member, loading } = useUser()

  return (
    <Page
      loading={loading}
      title="Account"
      description="Add features to your experience"
      requireAuth
    >
      <Plans allowSubscribe />
      <HStack mt={14} hidden>
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

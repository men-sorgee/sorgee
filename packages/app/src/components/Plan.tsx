import { sentenceCase } from "change-case";
import { ButtonConfirm, ButtonLink } from "components";
import { useProducts } from "hooks";
import {
  memberFeatures,
  MembershipNames,
  MembershipRenewalType,
  ProductView
} from "lib/models";
import { useEffect, useState } from "react";

import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Params = {
  plan: MembershipNames
  interval: MembershipRenewalType
}

export default function Plan({ plan, interval }: Params) {
  const { products, loading } = useProducts()
  const [product, setProduct] = useState<ProductView>(undefined)

  useEffect(() => {
    if (!loading && products) {
      const p = products.find((p) => p.type == plan)
      if (!p) return
      setProduct(p)
    }
  }, [loading, plan, products])

  if (loading || !product) return <></>

  return (
    <>
      <Flex
        direction={['column', 'column', 'row']}
        w={'full'}
        px={[4, 4, 6]}
        gap={2}
        justify="space-between"
        align={['center']}
        py={4}
      >
        <VStack w={['full', 'full', '50%']}>
          <Heading as="h2" fontSize="4xl" mt={0}>
            Your Plan: {product.name}
          </Heading>
          <Heading as="h3">
            ${product.prices[interval] / 100} /{' '}
            {interval == 'month' ? 'mo' : 'yr'}
          </Heading>
          <Text m={0} p={0}>
            {product.description}
          </Text>
        </VStack>

        <VStack gap={1} justify="space-between" align="start">
          <Heading as="h3" fontSize="md" mt={0}>
            Your Features:
          </Heading>
          {memberFeatures.map((feature) => (
            <Flex key={feature} justify="evenly" w="full" align="center">
              <CheckCircleIcon
                width="20px"
                color={product.features.includes(feature) ? 'green' : 'gray'}
              />
              <Text textAlign="left" p={0} mx={2} textTransform={'capitalize'}>
                {sentenceCase(feature, {
                  stripRegexp: /[^A-Za-z0-9\s]/g
                })}
              </Text>
            </Flex>
          ))}
        </VStack>

        <Flex direction={['column', 'row', 'column']} gap={2} h="full" mt={8}>
          <ButtonLink
            w="full"
            position="inherit"
            href="/api/stripe/portal"
            size="lg"
            bg="secondary.500"
            color="white"
            bottom={4}
            _hover={{ bg: 'accent.500' }}
          >
            Update Plan
          </ButtonLink>
          <ButtonConfirm
            w="full"
            position="inherit"
            onSuccess={async () => {
              window.location.href = '/api/stripe/cancel'
            }}
            size="lg"
            bg="red.500"
            color="white"
            bottom={4}
            _hover={{ bg: 'accent.500' }}
            buttonText="Cancel Plan"
            alertTitle="Cancel Plan"
          >
            <Text>Are you sure you want to cancel your plan?</Text>
          </ButtonConfirm>
        </Flex>
      </Flex>
    </>
  )
}

import { Member, ProgressType } from 'lib/models'
import { CheckIcon } from '@heroicons/react/24/solid'
import { Icon, Box, Flex, Text, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
export type MemberProgressCheckProps = {
  member: Member
  step: ProgressType
  size?: number
  label: string
  href?: string
}

export const MemberProgressCheck = ({
  member,
  step,
  size = 10,
  label,
  href
}: MemberProgressCheckProps) => {
  const hasStep = member?.progress && member?.progress.includes(step)
  return (
    <Flex dir="row" gap={2} align="start" justify="start">
      <Box>
        {(hasStep && (
          <Icon
            as={CheckIcon}
            blockSize={size}
            h={size}
            w={size}
            color="green.500"
          />
        )) || (
          <Box h={size} w={size} border="2px solid" borderColor="text"></Box>
        )}
      </Box>
      <Text
        fontWeight="bold"
        fontSize="lg"
        m={0}
        p={0}
        as={hasStep ? 's' : 'p'}
      >
        {(href && (
          <Link as={NextLink} href={href} color="white">
            {label}
          </Link>
        )) ||
          label}
      </Text>
    </Flex>
  )
}

import { Member, ProgressType } from "lib/models";
import NextLink from "next/link";
import React from "react";

import { Box, Flex, Icon, Link, Text } from "@chakra-ui/react";
import { CheckIcon } from "@heroicons/react/24/solid";

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
          <Box
            h={size}
            w={size}
            border="2px solid"
            borderColor="white"
            bg="white"
          >
            {' '}
            <Icon
              as={CheckIcon}
              blockSize={size}
              h={size + 2}
              w={size + 2}
              color="green.500"
              ml={-1}
              mt={-2}
            />
          </Box>
        )) || (
          <Box h={size} w={size} border="2px solid" borderColor="white"></Box>
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

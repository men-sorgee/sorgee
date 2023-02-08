import { UserGroupIcon, InboxIcon, CalendarIcon, MailIcon } from '@heroicons/react/outline'
import {
  useColorMode,
  useColorModeValue,
  HStack,
  IconButton,
  Flex,
  Collapse,
  Link,
} from '@chakra-ui/react'
import { Box, BoxProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { constrained } from '.'
import NextLink from 'next/link'
import { useSession } from 'next-auth/react'
export type Props = BoxProps & {
  currentPath: string
}

export default function ActionsNav({ children, currentPath, ...props }: Props) {
  return (
    <Box
      {...props}
      as="nav"
      color={'white'}
      position="absolute"
      bottom={0}
      minH={'80px'}
      zIndex={1}
      width="100%"
      shadow="xl"
      bg={useColorModeValue('primary.800', 'black')}
    >
      <Flex justify="center" w="full" gap={10} p={4}>
        <Link href="/members" as={NextLink}>
          <IconButton
            variant="primary"
            size="lg"
            icon={<UserGroupIcon />}
            color={currentPath === '/members' ? 'accent.500' : 'white'}
            aria-label={'View Members'}
            title="View Members"
          />
        </Link>
        <Link href="/member/events" as={NextLink}>
          <IconButton
            variant="primary"
            size="lg"
            icon={<InboxIcon />}
            color={currentPath === '/member/events' ? 'accent.500' : 'white'}
            aria-label={'Invites'}
            title="Invites"
          />
        </Link>
      </Flex>
    </Box>
  )
}

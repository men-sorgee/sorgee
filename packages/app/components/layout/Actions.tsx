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
export type Props = BoxProps & {}

export default function ActionsNav({ children, ...props }: Props) {
  const router = useRouter()
  const [path, setPath] = useState(router.asPath)
  useEffect(() => {
    setPath(router.asPath)
  }, [router, router.asPath])
  return (
    <Box
      {...props}
      as="nav"
      color={'white'}
      width="100%"
      minH={'80px'}
      shadow="xl"
      bg={useColorModeValue('primary.800', 'black')}
      borderTop="1px solid"
      borderTopColor={useColorModeValue('primary.500', 'accent.400')}
    >
      <Flex justify="center" w="full" gap={10} p={4} {...constrained}>
        <Link href="/members" as={NextLink}>
          <IconButton
            variant="primary"
            size="lg"
            icon={<UserGroupIcon />}
            color={path.startsWith('/members') ? 'accent.500' : 'white'}
            aria-label={'View Members'}
            title="View Members"
          />
        </Link>
        <Link href="/events" as={NextLink}>
          <IconButton
            variant="primary"
            size="lg"
            icon={<CalendarIcon />}
            color={path.startsWith('/events') ? 'accent.500' : 'white'}
            aria-label={'Events'}
            title="Public Events"
          />
        </Link>
        <Link href="/member/events" as={NextLink}>
          <IconButton
            variant="primary"
            size="lg"
            icon={<InboxIcon />}
            color={path.startsWith('/member/events') ? 'accent.500' : 'white'}
            aria-label={'Invites'}
            title="My Events"
          />
        </Link>
      </Flex>
    </Box>
  )
}

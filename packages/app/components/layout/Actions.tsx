import { UserGroupIcon, CalendarIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import { useColorModeValue, IconButton, Spacer, Flex, Link, Badge } from '@chakra-ui/react'
import { Box, BoxProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { constrained } from '.'
import NextLink from 'next/link'
import { useUser, useUserEvents } from 'hooks'
import Notifications from './Notifications'
import Messages from './Messages'
export type Props = BoxProps & {}

export default function ActionsNav({ children, ...props }: Props) {
  const router = useRouter()
  const { authenticated, isMember, member } = useUser()
  const [path, setPath] = useState(router.asPath)
  const { newInvitationCount } = useUserEvents()

  useEffect(() => {
    setPath(router.asPath)
  }, [router, router.asPath, authenticated])

  const bgColor = useColorModeValue('primary.800', 'black')
  const borderColor = useColorModeValue('primary.500', 'accent.400')
  const user_count = 0
  if (!authenticated || !isMember) return null

  return (
    <div className="no-print">
      <Box
        {...props}
        as="nav"
        color={'white'}
        width="100%"
        minH={'80px'}
        shadow="xl"
        bg={bgColor}
        borderTop="1px solid"
        borderTopColor={borderColor}
        position="fixed"
        zIndex="fixed"
        bottom={0}
        pr="16px"
      >
        <Flex justify="center" w="full" gap={10} p={4} {...constrained}>
          {false && <Messages member={member} />}
          <Spacer />
          <Link href="/members" as={NextLink} zIndex="fixed">
            <IconButton
              variant="primary"
              size="lg"
              zIndex="fixed"
              icon={<UserGroupIcon height="50px" width="50px" />}
              color={path.startsWith('/members') ? 'accent.500' : 'white'}
              aria-label={'View Members'}
              title="View Members"
            />
          </Link>
          <Link href="/video" as={NextLink}>
            <IconButton
              variant="primary"
              zIndex="fixed"
              size="lg"
              icon={<VideoCameraIcon height="50px" width="50px" />}
              color={path.startsWith('/video') ? 'accent.500' : 'white'}
              aria-label={'Video Chat'}
              title="Video Chat"
            />
            {user_count > 0 && (
              <Badge
                ml={-4}
                zIndex="overlay"
                position="absolute"
                bg="accent.500"
                rounded="full"
                px={2}
                py={0.5}
                color="white"
                title="Calendar Events"
              >
                {user_count}
              </Badge>
            )}
          </Link>
          <Link href="/events" as={NextLink}>
            <IconButton
              variant="primary"
              zIndex="fixed"
              size="lg"
              icon={<CalendarIcon height="50px" width="50px" />}
              color={path.startsWith('/events') ? 'accent.500' : 'white'}
              aria-label={'Calendar'}
              title="Calendar"
            />
            {newInvitationCount > 0 && (
              <Badge
                ml={-4}
                zIndex="overlay"
                position="absolute"
                bg="accent.500"
                rounded="full"
                px={2}
                py={0.5}
                color="white"
              >
                {newInvitationCount}
              </Badge>
            )}
          </Link>
          <Spacer />
          <Notifications member={member} />
        </Flex>
      </Box>
    </div>
  )
}

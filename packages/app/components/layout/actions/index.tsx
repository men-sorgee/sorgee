import { UserGroupIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import { useColorModeValue, IconButton, Spacer, Flex, Link, Badge } from '@chakra-ui/react'
import { Box, BoxProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { constrained } from '..'
import { useUser } from 'hooks'
import Notifications from './Notifications'
import Buddies from './Buddies'
import Messages from './Messages'
import Events from './Events'
import Members from './Members'

export type Props = BoxProps & {}

export default function ActionsNav({ children, ...props }: Props) {
  const router = useRouter()
  const { authenticated, isMember, member, level } = useUser()
  const [path, setPath] = useState(router.asPath)

  useEffect(() => {
    setPath(router.asPath)
  }, [router, router.asPath, authenticated])

  const bgColor = useColorModeValue('primary.800', 'black')
  const borderColor = useColorModeValue('primary.500', 'accent.400')
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
          <Messages member={member} />
          <Members member={member} active={path.startsWith('/members')} />
          <Buddies member={member} active={path.startsWith('/member/buddies')} />
          <Events member={member} active={path.startsWith('/events')} />
          <Notifications member={member} />
        </Flex>
      </Box>
    </div>
  )
}

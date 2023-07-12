import { useEffect, useState } from 'react'

import { useUser } from 'hooks'
import { useRouter } from 'next/router'

import { Box, Flex, useColorModeValue } from '@chakra-ui/react'

import { constrained } from '../'
import { MemberLevel } from 'lib/models'
import Buddies from './Buddies'
import Chat from './Chat'
import Events from './Events'
import Members from './Members'
import AppNotifications from './Notifications'
import Pledges from './Pledges'

export default function ActionsNav() {
  const router = useRouter()
  const { authenticated, isMember, member, hasFeature } = useUser({
    minLevel: MemberLevel.inductee,
    redirectsEnabled: false
  })
  const [path, setPath] = useState(router.asPath)

  useEffect(() => {
    setPath(router.asPath)
  }, [router, router.asPath, authenticated])

  const bgColor = useColorModeValue('primary.800', 'black')
  const borderColor = useColorModeValue('primary.500', 'accent.400')
  if (!authenticated || !isMember) return null

  const hasDirectory = hasFeature('view_directory')
  const hasChat = hasFeature('chat')
  const hasBuddyList = hasFeature('buddy_list')

  return (
    <Box
      as="nav"
      className="no-print"
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
      <Flex justify="center" w="full" gap={[1, 1, 4, 6]} p={4} {...constrained}>
        <Chat member={member} hasFeature={hasChat} />
        <Events member={member} active={path.startsWith('/events')} />
        <Members
          member={member}
          active={path.startsWith('/members') && !path.includes('/pledges')}
          hasFeature={hasDirectory}
        />
        <Pledges member={member} active={path.startsWith('/members/pledges')} />
        <Buddies
          member={member}
          active={path.startsWith('/member/buddies')}
          hasFeature={hasBuddyList}
        />

        <AppNotifications member={member} />
      </Flex>
    </Box>
  )
}

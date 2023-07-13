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
import Notifications from './Notifications'
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

  let iconDimensions = ['35px', '40px', '50px']
  let iconSize = ['xs', 'sm', 'md', 'lg']

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
      <Flex justify="center" w="full" gap={0} p={4} {...constrained}>
        <Chat
          member={member}
          hasFeature={hasChat}
          iconSize={iconSize}
          iconDimensions={iconDimensions}
        />
        <Events
          member={member}
          active={path.startsWith('/events')}
          iconSize={iconSize}
          iconDimensions={iconDimensions}
        />
        <Members
          member={member}
          active={path.startsWith('/members') && !path.includes('/pledges')}
          hasFeature={hasDirectory}
          iconSize={iconSize}
          iconDimensions={iconDimensions}
        />
        <Pledges
          member={member}
          active={path.startsWith('/members/pledges')}
          iconSize={iconSize}
          iconDimensions={iconDimensions}
        />
        <Buddies
          member={member}
          active={path.startsWith('/member/buddies')}
          hasFeature={hasBuddyList}
          iconSize={iconSize}
          iconDimensions={iconDimensions}
        />

        <Notifications
          member={member}
          iconSize={iconSize}
          iconDimensions={iconDimensions}
        />
      </Flex>
    </Box>
  )
}

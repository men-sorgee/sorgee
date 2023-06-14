import { useColorModeValue, Flex, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { constrained } from '..'
import { useUser } from 'hooks'
import Notifications from './Notifications'
import Buddies from './Buddies'
import Chat from './Chat'
import Events from './Events'
import Members from './Members'

export default function ActionsNav() {
  const router = useRouter()
  const { authenticated, isMember, level, member, hasFeature } = useUser({
    forceLogin: false,
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
      <Flex justify="center" w="full" gap={[4, 6, 8, 10]} p={4} {...constrained}>
        <Chat member={member} hasFeature={hasChat} /> 
        <Events member={member} active={path.startsWith('/events')} />
        <Members member={member} active={path.startsWith('/members')} hasFeature={hasDirectory} />
        <Buddies member={member} active={path.startsWith('/member/buddies')} hasFeature={hasBuddyList} />
        <Notifications member={member} />
      </Flex>
    </Box>
  )
}

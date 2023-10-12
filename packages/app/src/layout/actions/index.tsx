import { useUser } from "hooks";
import { MemberLevel } from "lib/models";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";

import { Box, Flex, useColorModeValue } from "@chakra-ui/react";

import Buddies from "./Buddies";
import Chat from "./Chat";
import Events from "./Events";
import Members from "./Members";
import Notifications from "./Notifications";
import Pledges from "./Pledges";

export type ActionsBarProps = {
  constrained: Record<string, any> | any
}

const ActionsBar = forwardRef<HTMLDivElement, ActionsBarProps>(({ constrained }: ActionsBarProps, ref) => {
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
  let iconSize = ['xxs', 'xs', 'sm', 'md', 'lg']

  return (
    <Box
      ref={ref}
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
      px={8}
    >
      <Flex w="full" align='center' justify='space-between' gap={[2, 4, 6]} p={4} pl={[5, 12, 12, 0]} {...constrained}>

        <Events
          member={member}
          active={path.startsWith('/events')}
          iconSize={iconSize}
          iconDimensions={iconDimensions}
        />
        <Chat
          member={member}
          hasFeature={hasChat}
          active={path.startsWith('/member/messages')}
          iconSize={iconSize}
          iconDimensions={iconDimensions}
        />
        <Members
          member={member}
          active={
            path.startsWith('/members') &&
            !path.includes('/pledges') &&
            !path.includes('/chat')
          }
          hasFeature={hasDirectory}
          iconSize={iconSize}
          iconDimensions={iconDimensions}
        />
        <Pledges
          member={member}
          active={path.startsWith('/pledges')}
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
})

ActionsBar.displayName = 'ActionsBar'

export default ActionsBar

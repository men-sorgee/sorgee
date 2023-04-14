import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  IconButton,
  Badge,
  Text,
} from '@chakra-ui/react'
import { useMessages } from 'hooks'
import { ChatBubbleBottomCenterIcon as ChatIcon } from '@heroicons/react/24/solid'
import { Member, SearchableMember } from 'lib/models'

import { useEffect, useRef, useState } from 'react'

export function MemberChat({ member }: { member: Partial<SearchableMember> }) {
  const { conversations, chatWith } = useMessages()

  return (
    <>
      <Box>
        <IconButton
          aria-label="Messages"
          variant="primary"
          zIndex="fixed"
          color="primary.800"
          onClick={() => {
            chatWith(member)
          }}
          size="lg"
          icon={<ChatIcon height="50px" width="50px" />}
        />
        {/**hasNewMessages && (
          <Badge
            bg="red"
            color="white"
            ml={-4}
            zIndex="overlay"
            position="absolute"
            rounded="full"
            px={2}
            py={0.5}
          >
            {newMessageCount}
          </Badge>
        )**/}
      </Box>
    </>
  )
}

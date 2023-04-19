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
import { ChatBubbleBottomCenterIcon as ChatIcon } from '@heroicons/react/24/outline'
import { Member, SearchableMember } from 'lib/models'

import { useEffect, useRef, useState } from 'react'

export function MemberChat({ member }: { member: Partial<SearchableMember> }) {
  const { conversations, chatWith } = useMessages()
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const newMessagesFromUser = conversations[member?.id]?.messages?.filter((m) => m.status == 'new')
  useEffect(() => {
    if (newMessagesFromUser) {
      setHasNewMessages(newMessagesFromUser.length > 0)
    }
  }, [conversations, member?.id, newMessagesFromUser])
  return (
    <>
      <IconButton
        aria-label="Messages"
        variant="ghost"
        zIndex="fixed"
        color="white"
        onClick={() => {
          chatWith(member)
        }}
        size="lg"
        icon={<ChatIcon width="30px" />}
      />
      {hasNewMessages && (
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
          {newMessagesFromUser?.length}
        </Badge>
      )}
    </>
  )
}

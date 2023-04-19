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
import { Member } from 'lib/models'
import { Messages } from '../../controls/Messages'
import { useEffect, useRef, useState } from 'react'

type Props = { member: Member }
const MessagesActions = ({ member }: Props) => {
  const {
    conversations,
    hasNewMessages,
    newMessageCount,
    activeConversation,
    setActiveConversation,
  } = useMessages()
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => setActiveConversation(null),
    isOpen: activeConversation != undefined,
  })

  const [prevMessagesCount, setPrevMessagesCount] = useState(newMessageCount)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (newMessageCount > prevMessagesCount && !isOpen) {
      audioRef.current.volume = 0.5
      audioRef.current?.play()
      setPrevMessagesCount(newMessageCount)
    }
  }, [activeConversation, isOpen, newMessageCount, onOpen, prevMessagesCount])

  return (
    <>
      <Box>
        <IconButton
          aria-label="Messages"
          variant="primary"
          zIndex="fixed"
          color={isOpen ? 'accent.500' : 'white'}
          size="lg"
          icon={<ChatIcon height="50px" width="50px" />}
          onClick={() => setActiveConversation(Object.keys(conversations)[0])}
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
            {newMessageCount}
          </Badge>
        )}
      </Box>
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="primary.900" color="white" m={0} p={2}>
            Messages
          </DrawerHeader>
          <DrawerBody p={0} position="relative">
            <Messages currentUser={member} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default MessagesActions

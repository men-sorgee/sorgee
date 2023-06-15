import { useEffect, useRef, useState } from 'react'

import { Messages, UpgradeIcon } from 'components'
import { useMessages } from 'hooks'
import { Member, MemberLevel, MembershipType } from 'lib/models'

import {
  Badge,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure
} from '@chakra-ui/react'
import { ChatBubbleBottomCenterIcon as ChatIcon } from '@heroicons/react/24/outline'

type Props = {
  member: Member
  hasFeature: boolean
}

const ChatActions = ({ member, hasFeature }: Props) => {
  const {
    conversations,
    hasNewMessages,
    newMessageCount,
    activeId,
    setActiveId,
    lastActiveId
  } = useMessages()
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => setActiveId(undefined)
  })
  const [show, setShow] = useState<boolean>(undefined)
  const [prevMessagesCount, setPrevMessagesCount] = useState<number>(undefined)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (prevMessagesCount == undefined) {
      setPrevMessagesCount(newMessageCount)
    }
    if (newMessageCount > prevMessagesCount) {
      audioRef.current?.play()
      setPrevMessagesCount(newMessageCount)
    }
    if (show == undefined && member) {
      setShow(
        MemberLevel[member.user_type] >= MemberLevel.brother ||
          Object.keys(conversations).length > 0
      )
    }
    if (show == false && hasNewMessages) setShow(true)
    if (activeId && !isOpen) onOpen()
  }, [
    setActiveId,
    conversations,
    hasNewMessages,
    isOpen,
    member,
    member.user_type,
    newMessageCount,
    onOpen,
    prevMessagesCount,
    show,
    activeId
  ])

  const level = MemberLevel[member?.user_type]
  if (level < MemberLevel.brother) {
    return null
  }

  return (
    <>
      {hasFeature || hasNewMessages ? (
        <Box hidden={!show}>
          <IconButton
            aria-label="Messages"
            title="Messages"
            variant="primary"
            zIndex="fixed"
            color={isOpen ? 'accent.500' : 'white'}
            size="lg"
            icon={<ChatIcon height="50px" width="50px" />}
            onClick={() => {
              setActiveId(lastActiveId)
              onOpen()
            }}
          />
          {hasNewMessages && (
            <Badge
              bg="accent.500"
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
      ) : (
        <UpgradeIcon
          title="Member Chat"
          membershipType={MembershipType.plus}
          icon={<ChatIcon height="50px" width="50px" />}
        />
      )}
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />
      <Drawer
        placement={'left'}
        onClose={onClose}
        isOpen={isOpen}
        size={['full', 'lg']}
      >
        <DrawerOverlay />

        <DrawerContent>
          <DrawerHeader bg="primary.900" color="white" m={0} p={2}>
            Messages (beta)
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody p={0} position="relative">
            <Messages member={member} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ChatActions

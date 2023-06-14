import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  IconButton,
  Badge,
} from '@chakra-ui/react'
import { useMessages } from 'hooks'
import { ChatBubbleBottomCenterIcon as ChatIcon } from '@heroicons/react/24/outline'
import { Member, MemberLevel, MembershipType } from 'lib/models'
import { Messages } from '../../components/controls/Messages'
import { useEffect, useRef, useState } from 'react'
import { UpgradeIcon } from 'components/controls'

type Props = {
  member: Member
  hasFeature: boolean
}

const ChatActions = ({ member, hasFeature }: Props) => {
  const { conversations, hasNewMessages, newMessageCount, activeId, setActiveId, lastActiveId } =
    useMessages()
  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: () => setActiveId(undefined),
  })
  const [show, setShow] = useState<boolean>(undefined)
  const [prevMessagesCount, setPrevMessagesCount] = useState<number>(undefined)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (prevMessagesCount == undefined) {
      setPrevMessagesCount(newMessageCount)
    }
    if (newMessageCount > prevMessagesCount) {
      audioRef.current.volume = 0.5
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
    activeId,
  ])

  if (!hasFeature) return <UpgradeIcon
    title='Member Chat'
    membershipType={MembershipType.Plus}
    icon={<ChatIcon height="50px" width="50px" />}
  />

  return (
    <>
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
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} size={['full', 'lg']}>
        <DrawerOverlay />

        <DrawerContent>
          <DrawerHeader bg="primary.900" color="white" m={0} p={2}>
            Messages (beta)
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody p={0} position="relative">
            <Messages currentUser={member} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ChatActions

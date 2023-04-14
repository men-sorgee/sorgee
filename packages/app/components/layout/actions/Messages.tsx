import {
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
import { MessagesContext } from 'hooks'
import { ChatBubbleBottomCenterIcon as ChatIcon } from '@heroicons/react/24/outline'
import { Member } from 'lib/models'
import Chat from './Chat'

export default function MessagesPane({ member }: { member: Member }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <MessagesContext.Consumer>
        {({ conversations, hasNewMessages, newMessageCount }) => (
          <IconButton
            aria-label="Messages"
            variant="primary"
            zIndex="fixed"
            color={isOpen ? 'accent.500' : 'white'}
            size="lg"
            icon={<ChatIcon height="50px" width="50px" />}
            onClick={onOpen}
          >
            {hasNewMessages && (
              <Badge bg="red" color="white">
                {newMessageCount}
              </Badge>
            )}
          </IconButton>
        )}
      </MessagesContext.Consumer>

      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="primary.900" color="white" m={0} p={2}>
            Messages
          </DrawerHeader>
          <DrawerBody>
            <Chat currentUser={member} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

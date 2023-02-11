import { useNotifications } from 'hooks/use-notifications'
import {
  Button,
  Alert,
  AlertTitle,
  Heading,
  chakra,
  HStack,
  AlertDescription,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { AppNotification } from 'lib/models'
import { Markdown } from './Markdown'
import { LinkButton } from './LinkButton'

type Props = {
  notification: AppNotification
}

export const NotificationCard = chakra(({ notification }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mark } = useNotifications()
  const [isNew] = useState(notification.status === 'new')

  const openMessage = () => {
    mark(notification.id, 'read')
    onOpen()
  }
  const markAsDeleted = async () => {
    await mark(notification.id, 'deleted')
    onClose()
  }
  return (
    <>
      <Alert
        boxShadow="md"
        mb={4}
        cursor="pointer"
        border={'1px solid'}
        borderColor="text"
        colorScheme={isNew ? 'purple' : 'white'}
        onClick={openMessage}
        borderRadius={'5px'}
        flexDirection="column"
        alignItems="flex-start"
      >
        <AlertTitle fontWeight="bold">{notification.subject}</AlertTitle>
        <AlertDescription textAlign={'left'}>{notification.message}</AlertDescription>
      </Alert>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">{notification?.subject}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{notification?.body && <Markdown content={notification?.body} />}</ModalBody>
          <ModalFooter>
            <HStack spacing={2} align="right">
              {notification?.link && (
                <LinkButton onClick={onClose} href={notification?.link} colorScheme="purple">
                  Go!
                </LinkButton>
              )}
              <Button onClick={markAsDeleted} colorScheme="red">
                Delete
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
})

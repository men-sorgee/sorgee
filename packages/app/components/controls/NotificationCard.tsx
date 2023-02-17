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
import { useEffect, useState } from 'react'
import { AppNotification, Member } from 'lib/models'
import { Markdown } from './Markdown'
import { LinkButton } from './LinkButton'

type Props = {
  notification: AppNotification
  member: Member
}

export const NotificationCard = chakra(({ member, notification }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mark } = useNotifications()
  const [isNew, setIsNew] = useState<boolean>(undefined)
  const [body, setBody] = useState<string>(undefined)
  const [message, setMessage] = useState<string>(undefined)
  const [subject, setSubject] = useState<string>(undefined)
  useEffect(() => {
    let name = member?.nickname || member?.first_name || 'Friend'
    if (member && body == undefined && notification?.body) {
      setBody(notification.body.replace(/\$NAME\$/g, name))
    }
    if (member && message == undefined && notification?.message) {
      setMessage(notification.message.replace(/\$NAME\$/g, name))
    }
    if (member && subject == undefined && notification?.subject) {
      setSubject(notification.subject.replace(/\$NAME\$/g, name))
    }
    if (isNew == undefined && notification.status == 'new') {
      setIsNew(true)
    }
  }, [
    body,
    isNew,
    member,
    message,
    notification?.body,
    notification?.message,
    notification?.status,
    notification?.subject,
    subject,
  ])

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
        {subject && <AlertTitle fontWeight="bold">{subject}</AlertTitle>}
        {message && <AlertDescription textAlign={'left'}>{message}</AlertDescription>}
      </Alert>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          {subject && (
            <ModalHeader>
              <Heading size="lg">{subject}</Heading>
            </ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody>{body && <Markdown content={body} />}</ModalBody>
          <ModalFooter>
            <HStack spacing={2} align="right">
              {notification?.link && (
                <LinkButton onClick={onClose} href={notification?.link} colorScheme="purple">
                  {notification?.button_text || 'Check it Out!'}
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

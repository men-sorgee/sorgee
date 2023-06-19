import { useEffect, useState } from 'react'

import { useAppNotifications } from '@hooks/use-app-notifications'
import { AppNotification, Member } from 'lib/models'

import {
  Alert,
  AlertTitle,
  Button,
  chakra,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'

import { ButtonLink } from './ButtonLink'
import { Markdown } from './Markdown'

type Props = {
  notification: AppNotification
  member: Member
}

export const NotificationCard = chakra(({ member, notification }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { markAsRead, delete: del } = useAppNotifications()
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
    subject
  ])

  const openMessage = () => {
    markAsRead(notification.id)
    onOpen()
  }
  const markAsDeleted = async () => {
    del(notification.id)
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
        {subject && (
          <AlertTitle fontWeight={isNew ? 'bold' : 'normal'}>
            {subject}
          </AlertTitle>
        )}
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
          <ModalBody>
            {body && <Markdown content={message} size="md" />}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={2} align="right">
              {notification?.link && (
                <ButtonLink
                  onClick={onClose}
                  href={notification?.link}
                  colorScheme="accent"
                  color="white"
                >
                  {notification?.button_text || 'Check it Out!'}
                </ButtonLink>
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

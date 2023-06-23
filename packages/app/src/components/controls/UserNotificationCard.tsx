import { useEffect, useState } from 'react'

import { useUserNotifications } from 'hooks'
import { UserNotification, Member } from 'lib/models'

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
  notification: UserNotification
  member: Member
  onClick?: () => void
}

export const UserNotificationCard = chakra(
  ({ member, notification, onClick }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { markAsRead, delete: del } = useUserNotifications()
    const [isNew, setIsNew] = useState<boolean>(undefined)
    const [message, setMessage] = useState<string>(undefined)
    useEffect(() => {
      let name = member?.nickname || member?.first_name || 'Friend'
      if (member && message == undefined && notification?.message) {
        setMessage(notification.message.replaceAll(/\$NAME\$/g, name))
      }
      if (isNew == undefined) {
        setIsNew(!notification.read)
      }
    }, [isNew, member, message, notification.message, notification.read])

    const openMessage = () => {
      markAsRead(notification.id).then(() => {
        onOpen()
      })
    }
    const markAsDeleted = async () => {
      del(notification.id).then(() => {
        onClose()
      })
    }

    return (
      <>
        <Alert
          boxShadow="md"
          mb={4}
          cursor="pointer"
          border={'1px solid'}
          borderColor="text"
          bg="bg"
          borderRadius={'5px'}
          flexDirection="column"
          alignItems="flex-start"
          pt={0}
          onClick={onClick}
        >
          {' '}
          {message && <Markdown content={message} size="md" />}
          <HStack spacing={2} align="right">
            {notification?.button_url && (
              <ButtonLink
                size="xs"
                onClick={onClose}
                href={notification?.button_url}
                colorScheme="accent"
                color="white"
              >
                {notification?.button_text || 'Check it Out!'}
              </ButtonLink>
            )}
          </HStack>
        </Alert>
      </>
    )
  }
)

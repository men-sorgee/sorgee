import { useCallback, useEffect, useState } from 'react'
import { toLocalDate } from 'lib/utils'
import { useAppNotifications } from 'hooks/use-app-notifications'
import { AppNotification, Member } from 'lib/models'
import { EnvelopeIcon } from '@heroicons/react/24/solid'
import { EnvelopeOpenIcon } from '@heroicons/react/24/outline'
import {
  Text,
  Box,
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
  useDisclosure,
  Icon,
  Spacer,
  VStack,
  Collapse,
  useColorModeValue
} from '@chakra-ui/react'
import distance from 'date-fns/formatDistanceToNow'
import { ButtonLink } from './ButtonLink'
import { Markdown } from './Markdown'

type Props = {
  notification: AppNotification
  member: Member
}

export const AppNotificationCard = chakra(({ member, notification }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isMessageOpen, onToggle: toggleMessage } = useDisclosure()
  const { readAppNotification, deleteAppNotification, reloadAppNotifications } =
    useAppNotifications()
  const [isNew, setIsNew] = useState<boolean>(undefined)
  const [body, setBody] = useState<string>(undefined)
  const [message, setMessage] = useState<string>(undefined)
  const [subject, setSubject] = useState<string>(undefined)
  useEffect(() => {
    let name = member?.nickname || member?.first_name || 'Friend'
    if (member && body == undefined && notification?.body) {
      setBody(notification.body.replaceAll(/\$NAME\$/g, name))
    }
    if (member && message == undefined && notification?.message) {
      setMessage(notification.message.replaceAll(/\$NAME\$/g, name))
    }
    if (member && subject == undefined && notification?.subject) {
      setSubject(notification.subject.replaceAll(/\$NAME\$/g, name))
    }
    if (isNew == undefined) {
      setIsNew(!notification.read)
    }
  }, [
    body,
    isNew,
    member,
    message,
    notification.body,
    notification.message,
    notification.read,
    notification.status,
    notification.subject,
    subject
  ])

  const openMessage = useCallback(() => {
    onOpen()
    return readAppNotification(notification.id).then(() => {
      reloadAppNotifications()
    })
  }, [notification.id, onOpen, readAppNotification, reloadAppNotifications])

  const markAsDeleted = useCallback(() => {
    onClose()
    return deleteAppNotification(notification.id).then(() => {
      reloadAppNotifications()
    })
  }, [deleteAppNotification, notification.id, onClose, reloadAppNotifications])

  const bgNew = useColorModeValue('secondary.100', 'secondary.700')
  const bgRead = useColorModeValue('white', 'secondary.800')
  const textNew = useColorModeValue('secondary.800', 'secondary.100')
  const textRead = useColorModeValue('text', 'secondary.300')

  return (
    <>
      <HStack
        px={4}
        py={2}
        cursor="pointer"
        borderBottom={'1px solid'}
        borderColor="text"
        bg={isNew ? bgNew : bgRead}
        onClick={openMessage}
        alignItems="flex-start"
        justify="left"
      >
        <Icon
          color={isNew ? textNew : textRead}
          as={isNew ? EnvelopeIcon : EnvelopeOpenIcon}
          w={6}
          h={6}
        />
        <VStack alignContent="left" justify="left">
          <Text p={0} m={0} fontWeight={isNew ? 'bold' : 'normal'}>
            {subject}
          </Text>

          <Collapse in={isMessageOpen} animateOpacity>
            <Text as="div" noOfLines={3} textAlign="left" w="full">
              <Markdown content={notification?.message} size="sm" />
            </Text>
          </Collapse>
          <Text fontSize="xs" textAlign="right" w="full">
            Received {distance(toLocalDate(notification?.date_created))} ago
          </Text>
        </VStack>
      </HStack>
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
              <Button onClick={onClose}>Close</Button>
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
              <Spacer />
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

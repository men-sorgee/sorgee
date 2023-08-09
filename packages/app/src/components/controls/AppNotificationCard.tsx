import distance from "date-fns/formatDistanceToNow";
import { useAppNotifications } from "hooks/use-app-notifications";
import { AppNotification, Member } from "lib/models";
import { gradient } from "lib/utils";
import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Button,
  ButtonGroup,
  chakra,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { EnvelopeOpenIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  EnvelopeIcon,
  TrashIcon as TrashHover
} from "@heroicons/react/24/solid";

import { ButtonLink } from "./ButtonLink";
import { Markdown } from "./Markdown";

type Props = {
  notification: AppNotification
  member: Member
  closeDrawer?: () => void
}

export const AppNotificationCard = chakra(({ member, notification, closeDrawer }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
    subject,
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

  const [trashHover, setTrashHover] = useState<boolean>(false)
  const textNew = useColorModeValue('secondary.800', 'secondary.100')
  const textRead = useColorModeValue('text', 'secondary.300')

  return (
    <>
      <Alert
        mb={4}
        variant={notification?.read ? 'subtle' : 'left-accent'}
        borderRadius={'md'}
        alignItems="start"
        justifyItems="space-between"
        color="text"
        status="success"
        cursor="pointer"
        p={2}
        onClick={openMessage}
        gap={2}
      >
        <Icon
          color={isNew ? textNew : textRead}
          as={isNew ? EnvelopeIcon : EnvelopeOpenIcon}
          w={6}
          h={6}
        />
        <VStack alignItems="start" justify="center" w="full">
          <Text p={0} m={0} noOfLines={1} fontWeight={isNew ? 'bold' : 'normal'} flex={1}>
            {subject}
          </Text>
          <HStack w="full" gap={2} align="flex-start" justify="space-between">
            <Text fontSize="xs" textAlign="right" w="full" m={0} p={0}>
              Received {distance(new Date(notification?.date_created))} ago
            </Text>
          </HStack>
          {notification?.link && (
            <ButtonLink
              size="xs"
              href={notification?.link}
              onClick={(e) => {
                e.stopPropagation()
                closeDrawer?.()
              }}
              colorScheme="accent"
            >
              {notification?.button_text || 'Check it Out!'}
            </ButtonLink>
          )}
        </VStack>
        <Icon
          as={trashHover ? TrashHover : TrashIcon}
          w={4}
          h={4}
          cursor="pointer"
          title="Delete Notification"
          onMouseOver={() => setTrashHover(true)}
          onMouseOut={() => setTrashHover(false)}
          onClick={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            markAsDeleted()
          }}
        />
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
          <ModalBody>{body && <Markdown content={message} size="md" />}</ModalBody>
          <ModalFooter>
            <ButtonGroup size="xs">
              <Button
                onClick={onClose}
                bgGradient={gradient('primary')}
                _hover={{ bgGradient: gradient('primary', 100) }}
              >
                Close
              </Button>
              {notification?.link && (
                <ButtonLink
                  onClick={() => {
                    onClose()
                    closeDrawer?.()
                  }}
                  href={notification?.link}
                  colorScheme="accent"
                >
                  {notification?.button_text || 'Check it Out!'}
                </ButtonLink>
              )}
              <Spacer />
              <Button
                onClick={markAsDeleted}
                bgGradient={gradient('red')}
                _hover={{ bgGradient: gradient('red', 100) }}
              >
                Delete
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
})

import { useEffect, useState } from 'react'
import { UserNotification, Member } from 'lib/models'
import { toLocalDate } from 'lib/utils'
import distance from 'date-fns/formatDistanceToNow'
import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  chakra,
  HStack,
  Icon,
  IconButton,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react'

import { ButtonLink } from './ButtonLink'
import { Markdown } from './Markdown'
import { TrashIcon as TrashHover } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/outline'

type Props = {
  notification: UserNotification
  member: Member
  onRead: () => Promise<void>
  onClose?: () => Promise<void>
  onDelete: () => Promise<void>
}

export const UserNotificationCard = chakra(
  ({ member, notification, onClose, onDelete, onRead }: Props) => {
    const [working, setWorking] = useState<boolean>(false)
    const [message, setMessage] = useState<string>(undefined)

    useEffect(() => {
      let name = member?.nickname || member?.first_name || 'Friend'
      if (member && message == undefined && notification?.message) {
        setMessage(notification.message.replaceAll(/\$NAME\$/g, name))
      }
    }, [
      member,
      message,
      notification.id,
      notification.message,
      notification.read
    ])

    if (working) return null

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
          bg="bg"
          cursor="pointer"
          p={2}
          gap={2}
          onClick={() => {
            return onRead()
          }}
        >
          <AlertIcon color="text" w={[6]} h={[6]} />{' '}
          <VStack alignItems="start" justify="center" w="full">
            {message && (
              <Text
                p={0}
                m={0}
                fontWeight={notification?.read ? 'normal' : 'bold'}
                flex={1}
              >
                {message}
              </Text>
            )}
            <HStack w="full" gap={2} align="flex-start" justify="space-between">
              <Text fontSize="xs" w="full" m={0} p={0}>
                Received {distance(new Date(notification?.date_created))} ago
              </Text>
            </HStack>
            <ButtonGroup size="sm">
              {notification?.button_url && (
                <ButtonLink
                  href={notification?.button_url}
                  colorScheme="primary"
                  color="white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setWorking(true)
                    return onRead().then(() => setWorking(false))
                  }}
                  replace={false}
                >
                  View
                </ButtonLink>
              )}
              {onClose != undefined && (
                <Button
                  bg="primary.500"
                  color="white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setWorking(true)
                    return onRead()
                      .then(() => onClose())
                      .then(() => setWorking(false))
                  }}
                >
                  Close
                </Button>
              )}
              <Button
                bg="red.400"
                color="white"
                onClick={(e) => {
                  e.stopPropagation()
                  setWorking(true)
                  return onRead()
                    .then(() => onDelete())
                    .then(() => setWorking(false))
                }}
              >
                Delete
              </Button>
            </ButtonGroup>
          </VStack>
        </Alert>
      </>
    )
  }
)

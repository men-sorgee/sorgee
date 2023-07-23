import { useEffect, useState } from 'react'
import { UserNotification, Member } from 'lib/models'
import { toLocalDate } from 'lib/utils'
import distance from 'date-fns/formatDistanceToNow'
import {
  Alert,
  AlertIcon,
  chakra,
  HStack,
  Icon,
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
  onClick?: () => Promise<void> | void
  onDelete?: () => Promise<void> | void
}

export const UserNotificationCard = chakra(
  ({ member, notification, onClick, onDelete }: Props) => {
    const [working, setWorking] = useState<boolean>(false)
    const [message, setMessage] = useState<string>(undefined)
    const [trashHover, setTrashHover] = useState<boolean>(false)
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
            setWorking(true)
            onClick()
          }}
        >
          <AlertIcon color="text" />{' '}
          <VStack alignItems="start" justify="center" w="full">
            {message && (
              <Text
                p={0}
                m={0}
                noOfLines={1}
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
            {notification?.button_url && (
              <ButtonLink
                size="xs"
                href={notification?.button_url}
                colorScheme="accent"
                color="white"
                onClick={async () => {
                  setWorking(true)
                  await onClick()
                  return true
                }}
                replace={false}
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
            onClick={async () => {
              setWorking(true)
              onDelete()
              setMessage(undefined)
              await onClick()
            }}
          />
        </Alert>
      </>
    )
  }
)

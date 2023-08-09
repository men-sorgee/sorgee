import distance from "date-fns/formatDistanceToNow";
import { Member, UserNotification } from "lib/models";
import { useEffect, useState } from "react";

import {
  Alert,
  AlertIcon,
  ButtonGroup,
  chakra,
  CloseButton,
  HStack,
  IconButton,
  Text,
  VStack
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/outline";

import { gradient } from "../../lib/utils";
import { ButtonLink } from "./ButtonLink";

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
    }, [member, message, notification.id, notification.message, notification.read])

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
          w="full"
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
                w="full"
              >
                {onClose != undefined && (
                  <CloseButton
                    size="sm"
                    float="right"
                    onClick={(e) => {
                      e.stopPropagation()
                      return onRead().then(() => onClose())
                    }}
                  />
                )}
                {message}
              </Text>
            )}
            <HStack w="full" gap={2} align="flex-start" justify="space-between">
              <Text fontSize="xs" w="full" m={0} p={0}>
                <em>Received {distance(new Date(notification?.date_created))} ago</em>
              </Text>
            </HStack>
            <ButtonGroup size="xs" w="full" display="flex" justifyItems="space-between">
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
                  {notification?.button_text}
                </ButtonLink>
              )}

              <IconButton
                icon={<TrashIcon width={15} />}
                title="Delete"
                aria-label="Delete"
                bgGradient={gradient('red')}
                _hover={{ bgGradient: gradient('red', 100) }}
                color="white"
                onClick={(e) => {
                  e.stopPropagation()
                  setWorking(true)
                  return onRead()
                    .then(() => onDelete())
                    .then(() => setWorking(false))
                }}
              />
            </ButtonGroup>
          </VStack>
        </Alert>
      </>
    )
  }
)

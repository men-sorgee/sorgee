import { ButtonLink } from "components";
import distance from "date-fns/formatDistanceToNow";
import { Member, MemberAlert } from "lib/models";
import { useEffect, useState } from "react";

import {
  Alert,
  AlertIcon,
  ButtonGroup,
  chakra,
  HStack,
  IconButton,
  Spacer,
  Text,
  VStack
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/outline";

import { gradient } from "../../lib/utils";

export type MemberAlertCardProps = {
  notification: MemberAlert
  member: Member
  onRead: () => Promise<void>
  onClose?: () => Promise<void>
  onDelete: () => Promise<void>
}

export const MemberAlertCard = chakra(
  ({ member, notification, onClose, onDelete, onRead }: MemberAlertCardProps) => {
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
          opacity={1}
          bg={'bg'}
          variant={notification?.read ? 'subtle' : 'left-accent'}
          borderRadius={'md'}
          alignItems="start"
          justifyItems="space-between"
          color="text"
          status={notification.icon}
          cursor="pointer"
          p={2}
          w="full"
          gap={2}
          onClick={async () => {
            await onRead()
            onClose()
          }}
        >
          <AlertIcon color="text" w={[6]} h={[6]} />{' '}
          <VStack alignItems="start" justify="center" w="full">
            <Text
              p={0}
              m={0}

              fontWeight={notification?.read ? 'normal' : 'bold'}
              flex={1}
            >
              {message}
            </Text>
            <HStack w="full" gap={2} align="flex-start" justify="space-between">
              <Text fontSize="xs" w="full" m={0} p={0}>
                Received {distance(new Date(notification?.date_created))} ago
              </Text>
            </HStack>
            <ButtonGroup size="xs" w="full" justifyItems={'space-between'}>
              {notification?.button_url && (
                <ButtonLink
                  href={notification?.button_url}
                  colorScheme="primary"
                  color="white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setWorking(true)
                    onRead().then(() => setWorking(false))
                    return false
                  }}
                  replace={false}
                >
                  {notification?.button_text}
                </ButtonLink>
              )}
              <Spacer />
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

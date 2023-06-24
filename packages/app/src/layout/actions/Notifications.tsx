import { useCallback, useEffect, useState } from 'react'

import { AppNotificationCard, UserNotificationCard } from 'components/controls'
import { Member } from 'lib/models'

import {
  Badge,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  IconButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import { useUserNotifications, useAppNotifications } from 'hooks'

interface Props {
  member: Member
}

const NotificationsAction = ({ member }: Props) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [wait, setWait] = useState<boolean>(false)
  const {
    hasNewNotifications: hasNewAppNotifications,
    notifications: appNotifications,
    newNotificationCount: newAppNotificationCount
  } = useAppNotifications()
  const [activeNotification, setActiveNotification] =
    useState<string>(undefined)
  const {
    notifications,
    delete: del,
    markAsRead,
    notificationCount
  } = useUserNotifications()

  const popMessage = useCallback(() => {
    let notification = notifications?.pop()
    if (notification) {
      setActiveNotification(notification.id)
      markAsRead(notification.id).then(() => {
        let instance = toast({
          title: 'Notice',
          description: notification.message,
          status: 'info',
          duration: null,
          isClosable: true,
          position: 'top',
          onCloseComplete: () => {
            del(notification.id).then(() => {
              setActiveNotification(undefined)
              popMessage()
            })
          },
          render: () => (
            <UserNotificationCard
              member={member}
              notification={notification}
              onClick={() => {
                toast.close(instance)
              }}
            />
          )
        })
      })
    }
  }, [del, markAsRead, member, notifications, toast])

  useEffect(() => {
    if (isOpen && appNotifications?.length == 0) {
      onClose()
    }
    if (activeNotification == undefined) {
      popMessage()
    }
  }, [
    appNotifications,
    notifications,
    isOpen,
    notificationCount,
    onClose,
    popMessage,
    activeNotification
  ])

  return (
    <>
      {appNotifications?.length > 0 && (
        <Box>
          <IconButton
            aria-label="Notifications"
            variant="primary"
            zIndex="fixed"
            color={isOpen ? 'accent.500' : 'white'}
            size={['sm', 'md', 'lg']}
            icon={
              <Icon
                as={BellIcon}
                w={['35px', '40px', '50px']}
                h={['35px', '40px', '50px']}
              />
            }
            onClick={onOpen}
          />
          {hasNewAppNotifications && (
            <Badge
              bg="accent.500"
              color="white"
              ml={[-6, -8, -10]}
              zIndex="overlay"
              position="absolute"
              rounded="full"
              px={2}
              py={0.5}
            >
              {newAppNotificationCount}
            </Badge>
          )}
        </Box>
      )}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="primary.900" color="white" m={0} p={2}>
            Notifications
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody p={4}>
            <>
              {appNotifications?.map((notification) => (
                <AppNotificationCard
                  key={notification.id}
                  member={member}
                  notification={notification}
                />
              ))}
            </>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default NotificationsAction

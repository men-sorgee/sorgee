import {
  MemberAlertCard,
  MemberNotificationCard,
  UserNotifications
} from "components";
import { useAppNotifications, useUserNotifications } from "hooks";
import { Member } from "lib/models";
import { useEffect } from "react";

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
  useDisclosure
} from "@chakra-ui/react";
import { BellIcon } from "@heroicons/react/24/outline";

interface Props {
  member: Member
  iconSize?: string[]
  iconDimensions?: string[]
}

const NotificationsAction = ({ member, iconSize, iconDimensions }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { notifications, notificationCount, newNotificationCount, deleteNotification, markAsRead } =
    useUserNotifications()
  const { appNotifications, newAppNotificationCount, appNotificationCount } = useAppNotifications()

  useEffect(() => {
    if (isOpen && appNotificationCount == 0 && notificationCount == 0) {
      onClose()
    }
  }, [
    appNotifications?.length,
    appNotifications,
    isOpen,
    newAppNotificationCount,
    onClose,
    appNotificationCount,
    notificationCount,
  ])
  const totalNew = newAppNotificationCount + newNotificationCount
  const total = appNotificationCount + notificationCount

  if (total == 0) {
    return null
  }

  return (
    <>
      <UserNotifications member={member} />
      <Box>
        <IconButton
          aria-label="Notifications"
          variant="primary"
          zIndex="fixed"
          color={isOpen ? 'accent.500' : 'white'}
          size={iconSize}
          icon={<Icon as={BellIcon} w={iconDimensions} h={iconDimensions} />}
          onClick={onOpen}
          w={iconDimensions}
        />
        {totalNew > 0 && (
          <Badge
            bg="accent.500"
            color="white"
            ml={-4}
            zIndex="overlay"
            position="absolute"
            rounded="full"
            px={1.5}
            py={0.5}
            fontSize={10}
          >
            {totalNew}
          </Badge>
        )}
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="primary.900" color="white" m={0} p={2}>
            Notifications
            {(newAppNotificationCount > 0 && (
              <Badge color="white" bg="accent.500" ml={1}>
                {newAppNotificationCount + notificationCount}
              </Badge>
            )) || <Badge ml={1}>{appNotificationCount}</Badge>}
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody p={0}>
            {notifications?.map((notification) => (
              <MemberAlertCard
                key={notification.id}
                member={member}
                notification={notification}
                onRead={() => markAsRead(notification.id)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))}
            {appNotifications?.map((notification) => (
              <MemberNotificationCard
                key={notification.id}
                member={member}
                notification={notification}
                closeDrawer={onClose}
              />
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default NotificationsAction

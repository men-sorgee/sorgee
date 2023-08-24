import {
  MemberAlertCard,
  MemberNotificationCard,
  UserNotifications
} from "components";
import { useAlerts, useNotifications } from "hooks";
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

  const { alerts, alertCount, newAlertCount, deleteAlert, markAsRead } =
    useAlerts()
  const { notifications, newNotificationCount, notificationCount } = useNotifications()

  useEffect(() => {
    if (isOpen && alertCount == 0 && notificationCount == 0) {
      onClose()
    }
  }, [onClose, alertCount, notificationCount, isOpen])

  const totalNew = newAlertCount + newNotificationCount
  const total = alertCount + notificationCount

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
            {(totalNew > 0 && (
              <Badge color="white" bg="accent.500" ml={1}>
                {totalNew}
              </Badge>
            )) || <Badge ml={1}>{total}</Badge>}
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody p={0}>
            {alerts?.map((alert) => (
              <MemberAlertCard
                key={alert.id}
                member={member}
                notification={alert}
                onRead={() => markAsRead(alert.id)}
                onDelete={() => deleteAlert(alert.id)}
              />
            ))}
            {notifications?.map((notification) => (
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

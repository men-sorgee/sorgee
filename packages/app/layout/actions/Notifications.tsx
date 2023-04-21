import {
  Badge,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  MenuItem,
  IconButton,
  Box,
} from '@chakra-ui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import {
  NotificationsContext,
  NotificationsContextData,
  useNotifications,
} from 'hooks/use-notifications'
import { NotificationCard } from 'components/controls'
import { Member } from 'lib/models'
import { useEffect } from 'react'

interface Props {
  member: Member
}

const NotificationsAction = ({ member }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hasNewNotifications, notifications, newNotificationCount } = useNotifications()

  useEffect(() => {
    if (isOpen && notifications?.length == 0) {
      onClose()
    }
  }, [notifications, isOpen, onClose])

  return (
    <>
      {notifications?.length > 0 && (
        <Box>
          <IconButton
            aria-label="Notifications"
            variant="primary"
            zIndex="fixed"
            color={isOpen ? 'accent.500' : 'white'}
            size="lg"
            icon={<BellIcon height="50px" width="50px" />}
            onClick={onOpen}
          />
          {hasNewNotifications && (
            <Badge
              bg="accent.500"
              color="white"
              ml={-4}
              zIndex="overlay"
              position="absolute"
              rounded="full"
              px={2}
              py={0.5}
            >
              {newNotificationCount}
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
              {notifications?.map((notification) => (
                <NotificationCard
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

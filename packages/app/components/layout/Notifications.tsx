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
} from '@chakra-ui/react'
import { BellIcon as NotificationsOffIcon } from '@heroicons/react/outline'
import { BellIcon as NotificationsOnIcon } from '@heroicons/react/solid'
import { useNotifications } from 'hooks/use-notifications'
import { Notification } from 'components/ui'
import { useEffect } from 'react'

interface Props {
  setNotificationBadge: (hasNewNotifications: boolean) => void
}

const Notifications = ({ setNotificationBadge }: Props) => {
  const { notifications, hasNewNotifications, newNotificationCount } = useNotifications()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setNotificationBadge(hasNewNotifications)
  }, [notifications])

  return (
    <>
      <MenuItem
        icon={
          hasNewNotifications ? (
            <NotificationsOnIcon color={'white'} width={'1.5rem'} />
          ) : (
            <NotificationsOffIcon color={'white'} width={'1.5rem'} />
          )
        }
        bg="black"
        onClick={onOpen}
      >
        Notifications{' '}
        {hasNewNotifications && (
          <Badge bg="red" color="white">
            {newNotificationCount}
          </Badge>
        )}
      </MenuItem>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader bg="primary.800" color="white" m={0} p={2}>
            Notifications
          </DrawerHeader>
          <DrawerBody p={4}>
            <>
              {notifications?.map((notification) => (
                <Notification key={notification.id} notification={notification} />
              ))}
            </>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Notifications

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
} from '@chakra-ui/react'
import { BellIcon as NotificationsOffIcon } from '@heroicons/react/24/outline'
import { BellIcon as NotificationsOnIcon } from '@heroicons/react/24/solid'
import { NotificationsContext, NotificationsContextData } from 'hooks/use-notifications'
import { NotificationCard } from 'components/controls'
import { Member } from 'lib/models'

interface Props {
  member: Member
}

const Notifications = ({ member }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <NotificationsContext.Consumer>
      {({ hasNewNotifications, notifications, newNotificationCount }) => (
        <>
          <IconButton
            aria-label="Notifications"
            variant="primary"
            zIndex="fixed"
            color={isOpen ? 'accent.500' : 'white'}
            size="lg"
            icon={
              hasNewNotifications ? (
                <NotificationsOnIcon height="50px" width="50px" />
              ) : (
                <NotificationsOffIcon height="50px" width="50px" />
              )
            }
            onClick={onOpen}
          >
            {hasNewNotifications && (
              <Badge bg="red" color="white">
                {newNotificationCount}
              </Badge>
            )}
          </IconButton>

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
      )}
    </NotificationsContext.Consumer>
  )
}

export default Notifications

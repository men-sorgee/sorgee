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
          <MenuItem
            icon={
              hasNewNotifications ? (
                <NotificationsOnIcon color={'white'} width={'1.5rem'} />
              ) : (
                <NotificationsOffIcon color={'white'} width={'1.5rem'} />
              )
            }
            bg="black"
            _hover={{ bg: 'gray.400' }}
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

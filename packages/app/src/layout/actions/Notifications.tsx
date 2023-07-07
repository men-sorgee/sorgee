import { useEffect } from 'react'

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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure
} from '@chakra-ui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import { useAppNotifications, useUserNotifications } from 'hooks'

interface Props {
  member: Member
}

const NotificationsAction = ({ member }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    notifications,
    notificationCount,
    newNotificationCount,
    deleteNotification
  } = useUserNotifications()
  const {
    appNotifications,
    newAppNotificationCount,
    appNotificationCount,
    deleteAppNotification
  } = useAppNotifications()

  useEffect(() => {
    if (isOpen && appNotificationCount == 0 && notificationCount == 0) {
      onClose()
    }
  }, [
    appNotifications.length,
    appNotifications,
    isOpen,
    newAppNotificationCount,
    onClose,
    appNotificationCount,
    notificationCount
  ])
  const totalNew = newAppNotificationCount + newNotificationCount
  const total = appNotificationCount + notificationCount

  if (total == 0) {
    return null
  }

  return (
    <>
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
        {totalNew > 0 && (
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
            {totalNew}
          </Badge>
        )}
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader bg="primary.900" color="white" m={0} p={2}>
            Inbox
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody p={0}>
            <Tabs>
              <TabList>
                <Tab>
                  Notifications
                  {(newAppNotificationCount > 0 && (
                    <Badge color="white" bg="accent.500" ml={1}>
                      {newAppNotificationCount}
                    </Badge>
                  )) || <Badge ml={1}>{appNotificationCount}</Badge>}
                </Tab>
                <Tab>
                  Alerts
                  {(newNotificationCount > 0 && (
                    <Badge color="white" bg="accent.500" ml={1}>
                      {newNotificationCount}
                    </Badge>
                  )) || <Badge ml={1}>{notificationCount}</Badge>}
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {appNotifications?.map((notification) => (
                    <AppNotificationCard
                      key={notification.id}
                      member={member}
                      notification={notification}
                    />
                  ))}
                </TabPanel>
                <TabPanel>
                  {notifications?.map((notification) => (
                    <UserNotificationCard
                      key={notification.id}
                      member={member}
                      notification={notification}
                      onClick={() => {}}
                      onDelete={() => {
                        deleteNotification(notification.id).then(() => {})
                      }}
                    />
                  ))}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default NotificationsAction

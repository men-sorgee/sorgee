import { useCallback, useEffect, useState } from 'react'
import { UserNotificationCard } from 'components/controls'
import { Member, UserNotification } from 'lib/models'

import { useToast } from '@chakra-ui/react'
import { useUserNotifications, useAppNotifications } from 'hooks'

interface Props {
  member: Member
}

const UserNotifications = ({ member }: Props) => {
  const toast = useToast()

  const [activeNotification, setActiveNotification] =
    useState<UserNotification>(undefined)

  const { notifications, hasNewNotifications, deleteNotification, markAsRead } =
    useUserNotifications()

  const popMessage = useCallback(async () => {
    if (activeNotification == undefined) {
      let notification = notifications.filter((n) => !n.read)?.pop()
      if (notification) {
        setActiveNotification(notification)
      }
    }
  }, [activeNotification, notifications])

  useEffect(() => {
    if (activeNotification) {
      if (toast.isActive(activeNotification.id)) return
      if (activeNotification.read) {
        setActiveNotification(undefined)
        popMessage()
        return
      }
      toast({
        id: activeNotification.id,
        title: 'Notice',
        description: activeNotification.message,
        status: 'info',
        duration: null,
        isClosable: false,
        position: 'top',

        render: () => (
          <UserNotificationCard
            member={member}
            notification={activeNotification}
            onRead={() => {
              return markAsRead(activeNotification.id)
            }}
            onClose={async () => {
              toast.close(activeNotification.id)
              setActiveNotification(undefined)
              popMessage()
            }}
            onDelete={() => {
              return deleteNotification(activeNotification.id).then(() => {
                toast.close(activeNotification.id)
                setActiveNotification(undefined)
                popMessage()
              })
            }}
          />
        )
      })
    } else {
      toast.closeAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNotification, markAsRead, popMessage, toast])

  useEffect(() => {
    if (hasNewNotifications) {
      popMessage()
    }
  }, [hasNewNotifications, popMessage])

  return <></>
}

export { UserNotifications }

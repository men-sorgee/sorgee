import { Avatar, AvatarProps, AvatarBadge, chakra } from '@chakra-ui/react'
import { UserContext } from 'hooks/use-user'
import { NotificationsContext } from '../../hooks/use-notifications'

type Props = AvatarProps

export const MemberAvatar = chakra(({ ...props }: Props) => {
  return (
    <UserContext.Consumer>
      {({ name, picture }) => (
        <Avatar
          bg="accent.500"
          name={name}
          src={picture}
          showBorder
          borderWidth="2px"
          borderColor={'accent.300'}
          color="white"
          {...props}
        >
          <NotificationsContext.Consumer>
            {({ hasNewNotifications, newNotificationCount }) =>
              hasNewNotifications && (
                <AvatarBadge borderWidth="thin" boxSize="1em" bg="red">
                  {newNotificationCount}
                </AvatarBadge>
              )
            }
          </NotificationsContext.Consumer>
        </Avatar>
      )}
    </UserContext.Consumer>
  )
})

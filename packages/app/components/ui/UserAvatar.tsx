import { Avatar, AvatarBadge } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useMember, useNotifications } from 'hooks'
import { getAssetUrl } from 'lib/utils'

export default function UserAvatar() {
  const { hasNewNotifications, newNotificationCount } = useNotifications()
  const [pictureSrc, setPictureSrc] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const { member, loading } = useMember()

  useEffect(() => {
    if (!loading && member && name == null) {
      const { picture, first_name, last_name, nickname } = member
      if (!pictureSrc && picture) setPictureSrc(getAssetUrl(picture))
      if (!name) setName(nickname || `${first_name} ${last_name}`)
    }
  }, [member, name, pictureSrc, loading, newNotificationCount, hasNewNotifications])

  if (!member) return null

  return (
    <Avatar bg="accent.500" name={name} src={pictureSrc} color="white">
      {hasNewNotifications && (
        <AvatarBadge borderWidth="thin" boxSize="1em" bg="red">
          {newNotificationCount}
        </AvatarBadge>
      )}
    </Avatar>
  )
}

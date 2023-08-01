import { Member } from 'lib/models'
import { getAssetUrl } from 'lib/utils'

import { Avatar, AvatarProps, chakra } from '@chakra-ui/react'

type Props = AvatarProps & {
  member: Partial<Member>
  children?: React.ReactNode | React.ReactNode[]
}

export const MemberAvatar = chakra(({ member, children, ...props }: Props) => {
  if (!member) return null
  const { nickname, picture } = member
  return (
    <Avatar
      bg="accent.500"
      name={nickname}
      src={
        picture
          ? getAssetUrl(picture) + '?width=100&height=100&quality=80'
          : null
      }
      showBorder
      borderWidth="2px"
      borderColor="accent.300"
      color="white"
      loading="lazy"
      {...props}
    >
      {children}
    </Avatar>
  )
})

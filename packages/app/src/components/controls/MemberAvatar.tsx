import { SearchableMember } from '@lib/models'
import { getAssetUrl } from '@lib/utils'

import { Avatar, AvatarProps, chakra } from '@chakra-ui/react'

type Props = AvatarProps & {
  member: Partial<SearchableMember>
}

export const MemberAvatar = chakra(
  ({ member: { nickname, picture }, ...props }: Props) => {
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
      ></Avatar>
    )
  }
)

import { Avatar, AvatarProps, chakra } from '@chakra-ui/react'
import { UserContext } from 'hooks/use-user'
import { SearchableMember } from '../../lib/models'

type Props = AvatarProps & {
  member: Partial<SearchableMember>
}

export const MemberAvatar = chakra(({ member: { nickname, picture }, ...props }: Props) => {
  return (
    <Avatar
      bg="accent.500"
      name={nickname}
      src={picture ? picture + '?width=100&height=100&quality=80' : null}
      showBorder
      borderWidth="2px"
      borderColor={'accent.300'}
      color="white"
      {...props}
    ></Avatar>
  )
})

import { Avatar, AvatarProps, chakra } from '@chakra-ui/react'
import { UserContext } from 'hooks/use-user'

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
        ></Avatar>
      )}
    </UserContext.Consumer>
  )
})

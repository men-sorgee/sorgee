import { Member } from 'lib/models'
import { getAssetUrl, toLocalDate } from 'lib/utils'
import { useEffect, useState } from 'react'
import {
  Avatar,
  AvatarBadge,
  AvatarProps,
  Tooltip,
  chakra
} from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'
type Props = AvatarProps & {
  member: Partial<Member>
  children?: React.ReactNode | React.ReactNode[]
}

export const MemberAvatar = chakra(
  ({ member, color = 'white', children, size = 'md', ...props }: Props) => {
    const [lastLogin, setLastLogin] = useState<string | null>(null)

    useEffect(() => {
      if (member && !lastLogin) {
        setLastLogin(
          member?.last_login
            ? `Last login ${formatDistanceToNowStrict(
                toLocalDate(member.last_login)
              )} ago`
            : undefined
        )
      }
    }, [member, lastLogin])

    if (!member) return null
    const { nickname, first_name, picture, last_login } = member
    return (
      <Avatar
        bg="accent.500"
        name={nickname || first_name || 'Brother'}
        src={
          picture
            ? getAssetUrl(picture) + '?width=100&height=100&quality=60'
            : null
        }
        id={member?.id}
        showBorder
        borderWidth={2}
        borderColor="accent.300"
        color={color}
        loading="lazy"
        size={size}
        {...props}
      >
        {member?.presence == 'online' && (
          <Tooltip label={lastLogin} placement="top">
            <AvatarBadge
              borderWidth="thin"
              borderColor="green.500"
              bgGradient="linear(to-b, green.200, green.400)"
              boxSize={'.75em'}
              shadow="md"
            />
          </Tooltip>
        )}
      </Avatar>
    )
  }
)

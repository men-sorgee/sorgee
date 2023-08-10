import { formatDistanceToNowStrict } from "date-fns";
import { Member } from "lib/models";
import { getAssetUrl, gradient, toLocalDate } from "lib/utils";
import { useEffect, useState } from "react";

import {
  Avatar,
  AvatarBadge,
  AvatarProps,
  chakra,
  Tooltip
} from "@chakra-ui/react";

export type MemberAvatarProps = AvatarProps & {
  member: Partial<Member>
  children?: React.ReactNode | React.ReactNode[]
}

export const MemberAvatar = chakra(
  ({ member, color = 'white', children, size = 'md', ...props }: MemberAvatarProps) => {
    const [lastLogin, setLastLogin] = useState<string | null>(null)
    const { nickname, first_name, picture } = member || {
      nickname: 'Brother',
      first_name: '',
      picture: '',
    }
    useEffect(() => {
      if (member && !lastLogin) {
        setLastLogin(
          member?.last_login
            ? `Last login ${formatDistanceToNowStrict(toLocalDate(member.last_login))} ago`
            : undefined
        )
      }
    }, [member, lastLogin])

    if (!member) return null

    return (
      <Avatar
        bgGradient={gradient('primary', 300, 200)}
        name={nickname || first_name || 'Brother'}
        src={picture ? getAssetUrl(picture) + '?quality=60' : null}
        id={member?.id}
        showBorder
        borderWidth={2}
        borderColor="accent.300"
        color={color}
        loading="lazy"
        size={size}
        m={0}
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

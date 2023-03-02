import { Badge, BadgeProps, chakra } from '@chakra-ui/react'
import { MemberLevel, MemberLevelColorMap } from 'lib/models'
type Props = BadgeProps & {
  user_type: string
  size?: string
}

export const MemberBadge = chakra(({ user_type, size = 'md', ...props }: Props) => {
  if (!user_type) return null
  const levelValue = MemberLevel[user_type]
  const levelColor = MemberLevelColorMap[levelValue]
  const levelName = user_type.split('_').join(' ')
  return (
    <Badge
      {...props}
      rounded={size}
      size={size}
      textTransform={'uppercase'}
      bg={levelColor[0]}
      color="white"
    >
      {levelName}
    </Badge>
  )
})

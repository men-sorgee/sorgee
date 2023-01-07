import { Badge } from '@chakra-ui/react'
import { MemberLevel } from 'lib/models'
interface Props {
  user_type: string
  size?: string
}
const UserBadge = ({ user_type, size = 'md' }: Props) => {
  const colors = [
    ['red.300', 'red.600'],
    ['orange.300', 'orange.600'],
    ['yellow.300', 'yellow.600'],
    ['blue.300', 'blue.600'],
    ['cyan.300', 'cyan.600'],
    ['purple.300', 'purple.600'],
    ['pink.300', 'pink.600'],
  ]
  const levelValue = MemberLevel[user_type || 'subscriber']
  const levelColor = colors[levelValue]
  let level = MemberLevel[levelValue]
  if (level == 'member') level = 'brother'
  return (
    <Badge size={size} textTransform={'capitalize'} bg={levelColor} color="white">
      {level}
    </Badge>
  )
}

export { UserBadge }

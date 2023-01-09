import { Badge } from '@chakra-ui/react'
import { MemberLevel } from 'lib/models'
interface Props {
  user_type: string
  size?: string
}
const UserBadge = ({ user_type = 'subscriber', size = 'md' }: Props) => {
  const colors = [
    ['red.300', 'red.600'],
    ['orange.300', 'orange.600'],
    ['yellow.300', 'yellow.600'],
    ['blue.300', 'blue.600'],
    ['cyan.300', 'cyan.600'],
    ['purple.300', 'purple.600'],
    ['pink.300', 'pink.600'],
  ]
  const levelValue = MemberLevel[user_type]
  const levelColor = colors[levelValue]
  const levelName = (user_type == 'member' ? 'brother' : user_type).split('_').join(' ')
  return (
    <Badge rounded="md" size={size} textTransform={'uppercase'} bg={levelColor} color="white">
      {levelName}
    </Badge>
  )
}

export { UserBadge }

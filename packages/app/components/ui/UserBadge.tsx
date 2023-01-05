import { Badge } from '@chakra-ui/react'
import { Member, MemberLevel } from '../../lib/models'
const UserBadge = ({ user_type }: { user_type: string }) => {
  const colors = [
    'red.300',
    'orange.300',
    'yellow.300',
    'blue.300',
    'cyan.300',
    'purple.300',
    'pink.300',
  ]
  const levelValue = MemberLevel[user_type || 'subscriber']
  const levelColor = colors[levelValue]
  let level = MemberLevel[levelValue]
  if (level == 'member') level = 'brother'
  return (
    <Badge textTransform={'capitalize'} bg={levelColor}>
      {level}
    </Badge>
  )
}
export { UserBadge }

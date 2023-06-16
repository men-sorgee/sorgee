import { capitalCase } from 'change-case'

import { Badge, BadgeProps, chakra } from '@chakra-ui/react'

type Props = BadgeProps & {
  status: string
  type: string
  size?: string
}

const statusMap = {
  cancelled: '.5',
  planned: '.8',
  scheduled: '1',
  occurred: '.5',
}

/// background color, text color
const typeMap = {
  group_sex: ['accent.500', 'white'],
  watching_sports: ['blue', 'white'],
  outdoors: ['green', 'white'],
  dinner_party: ['red', 'white'],
  cocktails: ['pink', 'black'],
  game_night: ['yellow', 'black'],
  cards: ['purple', 'white'],
  Cigars: ['brown', 'white'],
  default: ['gray', 'white'],
}

export const EventBadge = chakra(({ status, type, size = 'md', ...props }: Props) => {
  if (!status || !type) return null
  const bgColor = typeMap[type] ? typeMap[type][0] : typeMap.default[0]
  const textColor = typeMap[type] ? typeMap[type][1] : typeMap.default[1]
  const opacity = statusMap[status]
  return (
    <Badge
      rounded={size}
      size={size}
      bg={bgColor}
      color={textColor}
      title={status}
      opacity={opacity}
      {...props}
    >
      {capitalCase(type)}
    </Badge>
  )
})

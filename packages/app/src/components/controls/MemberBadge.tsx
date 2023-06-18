import { MemberLevel, MemberLevelColorMap, User } from '@lib/models'

import {
  Badge,
  BadgeProps,
  chakra,
  HStack,
  Icon,
  Tooltip
} from '@chakra-ui/react'
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { MemberVouch } from './MemberVouch'

type Props = BadgeProps & {
  member: Partial<User>
  size?: string
}

export const MemberBadge = chakra(
  ({ member, size = 'md', ...props }: Props) => {
    if (!member) return null
    const levelValue: MemberLevel = MemberLevel[member.user_type]
    const levelColor = MemberLevelColorMap[levelValue]
    const levelName = member.user_type.split('_').join(' ')
    return (
      <HStack spacing={0}>
        <Badge
          {...props}
          rounded={size}
          fontSize={size}
          textTransform={'uppercase'}
          color={levelColor[1]}
          bg="white"
        >
          {levelName}
        </Badge>
        <MemberVouch member={member} size={size as any} />
        {levelValue == MemberLevel.pledge && (
          <Icon as={SparklesIcon} boxSize={8} color="yellow" />
        )}
        {levelValue >= MemberLevel.brother && (
          <Tooltip label="Verified" aria-label="Verified at an Event">
            <Icon as={CheckBadgeIcon} boxSize={8} color="white" />
          </Tooltip>
        )}
      </HStack>
    )
  }
)

import { MemberLevel, MemberLevelColorMap } from '@lib/models'

import { Badge, BadgeProps, chakra, HStack, Tooltip } from '@chakra-ui/react'
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid'

type Props = BadgeProps & {
  user_type: string
  size?: string
}

export const MemberBadge = chakra(
  ({ user_type, size = 'md', ...props }: Props) => {
    if (!user_type) return null
    const levelValue: MemberLevel = MemberLevel[user_type]
    const levelColor = MemberLevelColorMap[levelValue]
    const levelName = user_type.split('_').join(' ')
    return (
      <HStack spacing={2}>
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

        {levelValue >= MemberLevel.brother && (
          <Tooltip label="Verified" aria-label="Verified">
            <CheckBadgeIcon width="30px" style={{ color: 'white' }} />
          </Tooltip>
        )}

        {levelValue == MemberLevel.pledge && (
          <Tooltip
            label="Available for Adoption!"
            aria-label="Available for Adoption!"
          >
            <SparklesIcon width="30px" style={{ color: 'yellow' }} />
          </Tooltip>
        )}
      </HStack>
    )
  }
)

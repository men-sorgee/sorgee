import { MemberLevel, MemberLevelColorMap } from 'lib/models'
import Link from 'next/link'

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
        <Link
          href="/brothers"
          target="_blank"
          passHref
          title="Learn about brother-levels."
        >
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
        </Link>
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

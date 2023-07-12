import { MemberLevel, MemberLevelColorMap, Member } from 'lib/models'

import { Badge, BadgeProps, chakra, HStack, Icon } from '@chakra-ui/react'
import { CheckBadgeIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { MemberVouch } from './MemberVouch'
import { useUser } from '../../hooks'

type Props = BadgeProps & {
  member: Partial<Member>
  size?: string
}

export const MemberBadge = chakra(
  ({ member, size = 'md', ...props }: Props) => {
    if (!member) return null
    const levelValue: MemberLevel = MemberLevel[member.user_type]
    const levelColor = MemberLevelColorMap[levelValue]
    const levelName = member.user_type.split('_').join(' ')
    const { isMember, loading } = useUser()
    if (loading) return null
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
        {isMember && <MemberVouch member={member} size={size as any} />}

        {levelValue == MemberLevel.pledge && (
          <Icon
            as={SparklesIcon}
            boxSize={8}
            color="yellow"
            title="New Pledge!"
          />
        )}
        {levelValue >= MemberLevel.brother && (
          <Icon
            id={`verified-${member?.id}`}
            as={CheckBadgeIcon}
            boxSize={9}
            stroke="white"
            color="green"
            title="Verified at an Event"
            aria-label="Verified at an Event"
          />
        )}
      </HStack>
    )
  }
)

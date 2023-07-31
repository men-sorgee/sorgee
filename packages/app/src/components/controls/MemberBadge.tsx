import {
  MemberLevel,
  MemberLevelColorMap,
  Member,
  MembershipType
} from 'lib/models'
import { Badge, BadgeProps, chakra, HStack, Icon } from '@chakra-ui/react'
import {
  CheckBadgeIcon,
  SparklesIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/solid'
import { MemberVouch } from './MemberVouch'
import { useUser } from 'hooks'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Props = BadgeProps & {
  member: Partial<Member>
  size?: string
}

export const MemberBadge = chakra(
  ({ member, size = 'md', ...props }: Props) => {
    const [levelValue, setLevelValue] = useState<MemberLevel>(undefined)
    const [levelName, setLevelName] = useState<string>(undefined)
    const [levelColor, setLevelColor] = useState<string[]>([
      'red.500',
      'red.100'
    ])
    const [subscription, setSubscription] = useState<MembershipType>(undefined)
    const { isMember, loading } = useUser()

    useEffect(() => {
      if (member && levelValue == undefined) {
        let value = MemberLevel[member.user_type]
        let name = MemberLevel[value]
        setLevelValue(value)
        setLevelColor(MemberLevelColorMap[value])
        setLevelName(name)
        setSubscription(MembershipType[member.membership_type])
      }
    }, [isMember, levelValue, member, member?.id, member?.user_type])

    if (!member || loading) return null
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
            color="primary.500"
            title="Verified at an Event"
            aria-label="Verified at an Event"
          />
        )}
        {subscription > MembershipType.none && (
          <Link href={`/member/subscription`}>
            <Icon
              id={`subscribe-${member?.id}`}
              as={CurrencyDollarIcon}
              boxSize={9}
              stroke="white"
              color={`green.${subscription + 2}00`}
              ml={1}
              title={`Contributing Member - ${MembershipType[
                subscription
              ]?.toUpperCase()} Plan`}
            />
          </Link>
        )}
      </HStack>
    )
  }
)

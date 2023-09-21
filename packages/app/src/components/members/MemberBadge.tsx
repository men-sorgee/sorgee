import { MemberVouch } from "components";
import { differenceInDays } from "date-fns";
import { useUser } from "hooks";
import {
  Member,
  MemberLevel,
  MemberLevelColorMap,
  MembershipType
} from "lib/models";
import { memo, useEffect, useMemo, useState } from "react";

import { Badge, BadgeProps, chakra, HStack, Icon } from "@chakra-ui/react";
import { CheckBadgeIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";

export type MemberBadgeProps = BadgeProps & {
  member: Partial<Member>
  size?: string
  onChange?: () => void
}

export const MemberBadge = memo(chakra(function MemberBadge({ member, size = 'md', onChange, ...props }: MemberBadgeProps) {
  const [levelValue, setLevelValue] = useState<MemberLevel>(undefined)
  const [levelName, setLevelName] = useState<string>(undefined)
  const [levelColor, setLevelColor] = useState<string[]>(['red.500', 'red.100'])
  const [subscription, setSubscription] = useState<MembershipType>(undefined)
  const { isMember, level: viewerLevel, loading } = useUser()

  useEffect(() => {
    if (member && levelValue == undefined) {
      let value = MemberLevel[member?.user_type || 'applicant']
      let name = MemberLevel[value].replace('_', ' ').toUpperCase()
      setLevelValue(value)
      setLevelColor(MemberLevelColorMap[value])
      setLevelName(name)
      setSubscription(MembershipType[member?.membership_type || 'none'])
    }
  }, [isMember, levelValue, member, member?.id, member?.user_type])

  const pledgeAge = useMemo(() => member?.approved_date != undefined
    ? differenceInDays(new Date(), new Date(member.approved_date))
    : null
    , [member?.approved_date])

  const needsVoucher = useMemo(() => levelValue == MemberLevel.pledge && viewerLevel >= MemberLevel.brother, [levelValue, viewerLevel])

  if (!member || loading) return null

  return (
    <HStack spacing={1} alignItems="center" justify="flex-start">
      <Badge
        rounded={size}
        fontSize={size}
        textTransform={'uppercase'}
        color={needsVoucher ? 'white' : levelColor[1]}
        bg={needsVoucher ? 'accent.400' : "white"}
        py={1}
        px={2}
        mr={1}
        {...props}
      >
        {levelName}{needsVoucher ? <>: {pledgeAge} days</> : null}
      </Badge>
      {levelValue >= MemberLevel.pledge && <MemberVouch member={member} size={size as any} onChange={() => {
        if (onChange) onChange()
      }} />}

      {levelValue >= MemberLevel.brother && (
        <Icon
          as={CheckBadgeIcon}
          boxSize={9}
          stroke="white"
          color="primary.500"
          title="Verified at an Event"
          aria-label="Verified at an Event"
        />
      )}
      {subscription > MembershipType.none && (
        <Icon
          as={CurrencyDollarIcon}
          boxSize={9}
          stroke="white"
          color={`green.${subscription + 2}00`}
          title={`Contributing Member - ${MembershipType[subscription]?.toUpperCase()} Plan`}
        />
      )}
    </HStack>
  )
}))

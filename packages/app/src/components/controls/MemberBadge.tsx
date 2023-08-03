import { differenceInDays } from "date-fns";
import { useUser } from "hooks";
import {
  Member,
  MemberLevel,
  MemberLevelColorMap,
  MembershipType
} from "lib/models";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Badge,
  BadgeProps,
  chakra,
  Heading,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text
} from "@chakra-ui/react";
import {
  CheckBadgeIcon,
  CurrencyDollarIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";

import { MemberVouch } from "./MemberVouch";

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

    const pledgeAge =
      member?.approved_date != undefined
        ? differenceInDays(new Date(), new Date(member.approved_date))
        : null

    const needsVoucher =
      levelValue == MemberLevel.pledge && viewerLevel >= MemberLevel.brother

    if (!member || loading) return null

    const UserBadge = () =>
      needsVoucher ? (
        <Badge
          rounded={size}
          fontSize={size}
          textTransform="uppercase"
          cursor="pointer"
          color="white"
          bg="accent.300"
          py={1}
          px={2}
          mr={1}
          {...props}
        >
          {levelName}: {pledgeAge} days
        </Badge>
      ) : (
        <Badge
          rounded={size}
          fontSize={size}
          textTransform={'uppercase'}
          color={levelColor[1]}
          bg="white"
          py={1}
          px={2}
          mr={1}
          {...props}
        >
          {levelName}
        </Badge>
      )

    return (
      <HStack spacing={1} alignItems="center" justify="flex-start">
        <UserBadge />
        {needsVoucher && <MemberVouch member={member} size={size as any} />}

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
            title={`Contributing Member - ${MembershipType[
              subscription
            ]?.toUpperCase()} Plan`}
          />
        )}
      </HStack>
    )
  }
)

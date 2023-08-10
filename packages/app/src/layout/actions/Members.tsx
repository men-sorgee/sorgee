import { UpgradeIcon } from "components";
import { Member, MemberLevel, MembershipType } from "lib/models";
import NextLink from "next/link";

import { Icon, IconButton, Link } from "@chakra-ui/react";
import { UserGroupIcon } from "@heroicons/react/24/outline";

interface Props {
  member: Member
  active: boolean
  hasFeature: boolean
  iconSize?: string[]
  iconDimensions?: string[]
}

const MembersAction = ({ member, active, hasFeature, iconSize, iconDimensions }: Props) => {
  const level = MemberLevel[member?.user_type]
  if (level < MemberLevel.brother) {
    return <></>
  }

  if (!hasFeature)
    return (
      <UpgradeIcon
        title="Member Directory"
        membershipType={MembershipType.free}
        icon={<Icon as={UserGroupIcon} width={iconDimensions} height={iconDimensions} />}
        size={iconSize}
      />
    )

  return (
    <>
      <Link href="/members" as={NextLink} zIndex="fixed">
        <IconButton
          variant="primary"
          size={iconSize}
          w={iconDimensions}
          icon={<Icon as={UserGroupIcon} w={iconDimensions} h={iconDimensions} />}
          zIndex="fixed"
          color={active ? 'accent.500' : 'white'}
          aria-label={'View Members'}
          title="View Members"
        />
      </Link>
    </>
  )
}

export default MembersAction

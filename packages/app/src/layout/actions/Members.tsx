import { UpgradeIcon } from "components";
import { Member, MemberLevel, MembershipType } from "lib/models";
import NextLink from "next/link";

import { Badge, Icon, IconButton, Link } from "@chakra-ui/react";
import { UserGroupIcon } from "@heroicons/react/24/outline";

import { useGeolocation } from "../../hooks/use-geolocation";
import { useMemberSearch } from "../../hooks/use-members";

interface Props {
  member: Member
  active: boolean
  hasFeature: boolean
  iconSize?: string[]
  iconDimensions?: string[]
}

const MembersAction = ({ member, active, hasFeature, iconSize, iconDimensions }: Props) => {
  const level = MemberLevel[member?.user_type]
  const { capture } = useGeolocation(member?.show_location)

  const { count } = useMemberSearch(
    {
      online: true,
    },
    !hasFeature || level < MemberLevel.brother
  )

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
          onClick={() => capture()}
          size={iconSize}
          w={iconDimensions}
          icon={< Icon as={UserGroupIcon} w={iconDimensions} h={iconDimensions} />}
          zIndex="fixed"
          color={active ? 'accent.500' : 'white'}
          aria-label={'View Members'}
          title="View Members"
        />
        {count > 0 && (
          <Badge
            bg={active ? 'accent.500' : 'white'}
            color={active ? 'white' : 'accent.500'}
            ml={-4}
            zIndex="overlay"
            position="absolute"
            rounded="full"
            px={1.5}
            py={0.5}
            fontSize={10}
            title={`${count} members online`}
          >
            {count}
          </Badge>
        )}
      </Link>
    </>
  )
}

export default MembersAction

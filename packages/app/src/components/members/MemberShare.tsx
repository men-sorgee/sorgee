import { UpgradeIcon } from "components";
import { useUser } from "hooks";
import { Member, MemberLevel, MembershipType } from "lib/models";
import { deleteJSON, postJSON } from "lib/utils";
import { memo, useCallback, useEffect, useState } from "react";

import { chakra, IconButton, IconButtonProps } from "@chakra-ui/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { LockOpenIcon } from "@heroicons/react/24/solid";

export type MemberShareProps = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member>
}

export const MemberShare = memo(chakra(
  function MemberShare({ member, size = ['sm', 'md', 'lg'], ...props }: MemberShareProps) {
    const { loading, member: me, level, hasFeature } = useUser()
    const [hover, setHover] = useState(false)
    const [showLock, setShowLock] = useState(false)
    const [isShared, setIsShared] = useState<boolean>(false)

    const toggleShare = useCallback(() => {
      setIsShared(!isShared)
      if (isShared) {
        deleteJSON(`/api/members/${member?.id}/share`)
      } else {
        postJSON(`/api/members/${member?.id}/share`, {})
      }
    }, [isShared, member?.id])

    useEffect(() => {
      const shares = me?.photo_shares || []
      if (!loading && shares.length > 0) {
        setIsShared(shares.some((s) => s.viewer_id == member?.id))
      }
    }, [me, member?.id, loading])

    const label = isShared
      ? `Unshare Private Photos with ${member?.nickname || 'this member'}`
      : `Share Private Photos with ${member?.nickname || 'this member'}`

    // SWAP BETWEEN SHARED AND HOVER
    useEffect(() => {
      setShowLock(isShared ? !hover : hover)
    }, [hover, isShared])

    if (loading || !me) return null
    if (level < MemberLevel.brother) return null

    if (!hasFeature('share_photos'))
      return (
        <UpgradeIcon
          title={label}
          membershipType={MembershipType.plus}
          icon={<LockClosedIcon width="30px" />}
          size={size}
          _hover={{ bg: 'primary.500' }}
        />
      )

    return (
      <>
        <IconButton
          size={size}
          color={isShared ? 'yellow' : 'white'}
          title={label}
          aria-label={label}
          zIndex="fixed"
          variant="ghost"
          icon={
            showLock ? (
              <LockOpenIcon width="30px" />
            ) : (
              <LockClosedIcon width="30px" stroke="white" />
            )
          }
          _hover={{
            bg: 'primary.500',
          }}
          onClick={() => {
            if (me?.id == member?.id) return
            toggleShare()
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disabled={me?.id === member?.id}
          px={[.1, .5]}
          {...props}
        />
      </>
    )
  }
), (prev, next) => (prev.member?.id == next.member?.id && prev.isShared == next.isShared))

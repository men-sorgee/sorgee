import { useCallback, useEffect, useState } from 'react'

import { UpgradeIcon } from 'components/controls'
import { useUser } from 'hooks'
import {
  Member,
  MemberLevel,
  MembershipType,
  SearchableMember
} from '@lib/models'
import { deleteJSON, postJSON } from '@lib/utils'

import { chakra, IconButton, IconButtonProps } from '@chakra-ui/react'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member | SearchableMember>
}

export const MemberShare = chakra(
  ({ member, size = 'lg', ...props }: Props) => {
    const { loading, member: me, reload, level, hasFeature } = useUser()

    const [isShared, setIsShared] = useState<boolean>(false)

    const toggleShare = useCallback(() => {
      if (isShared) {
        deleteJSON(`/api/member/share/${member.id}`).then(() => {
          setIsShared(false)
          return reload()
        })
      } else {
        // add buddy
        postJSON(`/api/member/share/${member.id}`, {}).then((r) => {
          setIsShared(true)
          return reload()
        })
      }
    }, [isShared, member.id, reload])

    useEffect(() => {
      const shares = me?.photo_shares || []
      if (!loading && shares.length > 0) {
        setIsShared(shares.some((s) => s.viewer_id == member.id))
      }
    }, [me, member.id, loading])

    if (loading || !me || me.id == member.id) return null
    if (level < MemberLevel.brother) return null

    const label = isShared ? 'Unshare Private Photos' : 'Share Private Photos'

    if (!hasFeature('share_photos'))
      return (
        <UpgradeIcon
          title={label}
          membershipType={MembershipType.plus}
          icon={<LockClosedIcon width="30px" />}
        />
      )

    return (
      <>
        <IconButton
          size={size}
          color="white"
          title={label}
          aria-label={label}
          icon={
            isShared ? (
              <LockOpenIcon width="30px" />
            ) : (
              <LockClosedIcon width="30px" />
            )
          }
          variant="ghost"
          _hover={{ bg: 'primary.500' }}
          onClick={toggleShare}
          {...props}
        />
      </>
    )
  }
)

import { use, useCallback, useEffect, useState } from 'react'

import { UpgradeIcon } from 'components/controls'
import { useUser } from 'hooks'
import { MemberLevel, MembershipType, User } from 'lib/models'
import { deleteJSON, postJSON } from 'lib/utils'

import { chakra, IconButton, IconButtonProps } from '@chakra-ui/react'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { LockOpenIcon } from '@heroicons/react/24/solid'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<User>
}

export const MemberShare = chakra(
  ({ member, size = 'lg', ...props }: Props) => {
    const { loading, member: me, reload, level, hasFeature } = useUser()
    const [hover, setHover] = useState(false)
    const [showLock, setShowLock] = useState(false)
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

    const label = isShared
      ? `Unshare Private Photos with ${member?.nickname || 'this member'}`
      : `Share Private Photos with ${member?.nickname || 'this member'}`

    if (!hasFeature('share_photos'))
      return (
        <UpgradeIcon
          title={label}
          membershipType={MembershipType.plus}
          icon={<LockClosedIcon width="30px" />}
        />
      )

    // SWAP BETWEEN SHARED AND HOVER
    useEffect(() => {
      setShowLock(isShared ? !hover : hover)
    }, [hover, isShared])

    return (
      <>
        <IconButton
          size={size}
          color="white"
          title={label}
          aria-label={label}
          icon={
            showLock ? (
              <LockOpenIcon width="30px" />
            ) : (
              <LockClosedIcon width="30px" />
            )
          }
          variant="ghost"
          _hover={{
            bg: 'primary.500'
          }}
          onClick={toggleShare}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          {...props}
        />
      </>
    )
  }
)

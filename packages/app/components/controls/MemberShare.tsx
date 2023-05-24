import { IconButton, IconButtonProps, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text, Heading, Button, chakra } from '@chakra-ui/react'
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useState } from 'react'
import { useUser, useMember } from 'hooks'
import { deleteJSON, postJSON } from 'lib/utils'
import { UserShare } from 'lib/models'
import { MemberAvatar } from './MemberAvatar'
import swr from 'swr'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  memberId: string,
  reload: () => void,
}

export const MemberShare = chakra(({ memberId, size = 'lg', ...props }: Props) => {
  const { loading, member: me, reload } = useUser()
 
  const [isShared, setIsShared] = useState<boolean>(false)

  const toggleShare = useCallback(() => {
    if (isShared) {
      deleteJSON(`/api/member/share/${memberId}`).then(() => {
        setIsShared(false)
        return reload()
      })
    } else {
      // add buddy
      postJSON(`/api/member/share/${memberId}`, {}).then((r) => {
        setIsShared(true)
        return reload()
      })
    }
  }, [isShared, memberId, reload])

  useEffect(() => {
    const shares = me?.photo_shares || []
    if (!loading && shares.length > 0) {
      setIsShared(shares.some(s=> s.viewer_id == memberId))
    }
  }, [me, memberId, loading])


  if (loading || !me || me.id == memberId)
    return null
  
  const label = isShared ? "Unshare Private Photos" : "Share Private Photos"

  return (
    <>
      <IconButton
        size={size}
        color="white"
        title={label}
        aria-label={label}
        icon={isShared ? <LockOpenIcon width="30px" />: <LockClosedIcon width="30px" />}
        variant="ghost"
        _hover={{ bg: 'primary.500' }}
        onClick={toggleShare}
        {...props}
      />
    </>
  )
})

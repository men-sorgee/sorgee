import { useCallback, useEffect, useState } from 'react'

import { useUser } from 'hooks'
import { User } from 'lib/models'
import { deleteJSON, postJSON } from 'lib/utils'

import { chakra, IconButton, IconButtonProps } from '@chakra-ui/react'
import {
  EyeSlashIcon as BlockIcon,
  EyeIcon as ViewIcon
} from '@heroicons/react/24/outline'
import { EyeSlashIcon as BlockedIcon } from '@heroicons/react/24/solid'
import { UserBlock } from 'lib/models'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<User>
}

export const MemberBlock = chakra(
  ({ member, size = ['sm', 'md', 'lg'], ...props }: Props) => {
    const { loading, member: me, reload, level } = useUser()
    const [hover, setHover] = useState(false)
    const [showBlock, setShowBlock] = useState(false)
    const [isBlocked, setIsBlocked] = useState<boolean>(false)
    const [mutual, setMutual] = useState<boolean>(false)

    const toggleBlock = useCallback(() => {
      if (isBlocked) {
        deleteJSON(`/api/member/block/${member.id}`).then(() => {
          setIsBlocked(false)
          return reload()
        })
      } else {
        // add buddy
        postJSON(`/api/member/block/${member.id}`, {}).then((r) => {
          setIsBlocked(true)
          return reload()
        })
      }
    }, [isBlocked, member?.id, reload])

    useEffect(() => {
      const blockedList = (me?.blocked || []) as UserBlock[]
      const blockedByList = (me?.blocked_by || []) as UserBlock[]
      let blocked = blockedList.some(
        (l: UserBlock) => String(l.blocked_id as string) == member?.id
      )
      if (!loading && blockedList.length > 0) {
        setIsBlocked(blocked)
      }
      if (!loading && blocked && blockedByList.length > 0) {
        let blockedYou = blockedByList.some(
          (l: UserBlock) => String(l.user_id as string) == member?.id
        )
        setMutual(blocked && blockedYou)
      }
    }, [me, member?.id, loading])

    if (loading || !me || me?.id == member?.id) return null

    const label = isBlocked
      ? `Unblock ${member?.nickname || 'this member'}`
      : `Block ${member?.nickname || 'this member'}`

    // SWAP BETWEEN BLOCK AND HOVER
    useEffect(() => {
      setShowBlock(isBlocked ? !hover : hover)
    }, [hover, isBlocked])

    return (
      <>
        <IconButton
          size={size}
          color={mutual ? 'yellow' : 'white'}
          title={label}
          aria-label={label}
          icon={
            showBlock ? (
              <BlockedIcon width="30px" fill="white" />
            ) : (
              <ViewIcon width="30px" stroke="white" />
            )
          }
          variant="ghost"
          _hover={{ bg: 'primary.500' }}
          onClick={toggleBlock}
          {...props}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </>
    )
  }
)

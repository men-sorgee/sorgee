import { useCallback, useEffect, useState } from 'react'

import { useUser } from 'hooks'
import { Member, SearchableMember } from 'lib/models'
import { deleteJSON, postJSON } from 'lib/utils'

import { chakra, IconButton, IconButtonProps } from '@chakra-ui/react'
import { EyeSlashIcon as BlockIcon } from '@heroicons/react/24/outline'
import { EyeSlashIcon as BlockedIcon } from '@heroicons/react/24/solid'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member | SearchableMember>
}

export const MemberBlock = chakra(
  ({ member, size = 'lg', ...props }: Props) => {
    const { loading, member: me, reload, level } = useUser()

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
    }, [isBlocked, member.id, reload])

    useEffect(() => {
      const blocked = me?.blocked || []
      const blockedBy = me?.blocked_by || []
      if (!loading && blocked.length > 0) {
        setIsBlocked(blocked.some((l) => l.block_id == member.id))
      }
      if (!loading && blocked.length > 0) {
        setMutual(blockedBy.some((l) => l.user_id == member.id))
      }
    }, [me, member.id, loading])

    if (loading || !me || me.id == member.id) return null

    const label = isBlocked ? 'Blocked' : 'Block'

    return (
      <>
        <IconButton
          size={size}
          color={mutual ? 'yellow' : 'white'}
          title={label}
          aria-label={label}
          icon={
            isBlocked ? (
              <BlockedIcon width="30px" />
            ) : (
              <BlockIcon width="30px" />
            )
          }
          variant="ghost"
          _hover={{ bg: 'primary.500' }}
          onClick={toggleBlock}
          {...props}
        />
      </>
    )
  }
)

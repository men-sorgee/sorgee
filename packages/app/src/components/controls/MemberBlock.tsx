import { useCallback, useEffect, useState } from 'react'
import { ButtonConfirm } from './ButtonConfirm'
import { useUser } from 'hooks'
import { Member } from 'lib/models'
import { deleteJSON, postJSON } from 'lib/utils'

import { chakra, Text, IconButtonProps, Icon } from '@chakra-ui/react'
import { EyeIcon as ViewIcon } from '@heroicons/react/24/outline'
import { EyeSlashIcon as BlockedIcon } from '@heroicons/react/24/solid'
import { UserBlock, MemberLevel } from 'lib/models'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member>
}

export const MemberBlock = chakra(
  ({ member, size = ['sm', 'md', 'lg'], ...props }: Props) => {
    const { loading, member: me, reload } = useUser()
    const [hover, setHover] = useState(false)
    const [showBlock, setShowBlock] = useState(false)
    const [isBlocked, setIsBlocked] = useState<boolean>(false)
    const [mutual, setMutual] = useState<boolean>(false)

    const toggleBlock = useCallback(() => {
      setIsBlocked(!isBlocked)
      if (isBlocked) {
        return deleteJSON(`/api/member/block/${member.id}`).then(() => {
          setIsBlocked(false)
          return reload()
        })
      } else {
        // add buddy
        return postJSON(`/api/member/block/${member.id}`, {}).then((r) => {
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

    const label = isBlocked
      ? `Unblock ${member?.nickname || 'this member'}`
      : `Block ${member?.nickname || 'this member'}`

    // SWAP BETWEEN BLOCK AND HOVER
    useEffect(() => {
      setShowBlock(isBlocked ? !hover : hover)
    }, [hover, isBlocked])

    if (loading || !me || me?.id == member?.id) return <></>

    if (MemberLevel[member?.user_type || 'applicant'] == MemberLevel.staff)
      return <></>

    return (
      <>
        <ButtonConfirm
          size={size}
          color={mutual ? 'yellow' : 'white'}
          title={label}
          variant="secondary"
          _hover={{ bg: 'primary.500' }}
          promise={toggleBlock}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          successMessage="The user was blocked"
          failureMessage="The user could not be blocked"
          buttonText={isBlocked ? 'Unblock' : 'Block'}
          
          icon={
            showBlock ? (
              <BlockedIcon width="30px" fill="red" />
            ) : (
              <ViewIcon width="30px" stroke="white" />
            )
          }
          {...props}
        >
          {(isBlocked && (
            <Text>Are you sure you want to unblock {member?.nickname}?</Text>
          )) || (
            <Text>
              Are you sure you want to block {member?.nickname}? They will not
              be able to see you in the directory or view your profile. They
              will see your avatar on the event page.{' '}
            </Text>
          )}
        </ButtonConfirm>
      </>
    )
  }
)

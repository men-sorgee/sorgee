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
    const [isBlocked, setIsBlocked] = useState<boolean>(false)
    const [mutual, setMutual] = useState<boolean>(false)

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

    if (loading || !me) return <ViewIcon width="30px" stroke="white" />

    if (MemberLevel[member?.user_type || 'applicant'] == MemberLevel.staff)
      return <ViewIcon width="30px" stroke="white" />

    return (
      <>
        {(isBlocked && (
          <ButtonConfirm
            size={size}
            color={mutual ? 'yellow' : 'white'}
            alertTitle={`Unblock ${member?.nickname || 'this member'}`}
            title={`Unblock ${member?.nickname || 'this member'}`}
            variant="secondary"
            _hover={{ bg: 'primary.500' }}
            promise={() => deleteJSON(`/api/members/${member.id}/block`)}
            complete={() => {
              setIsBlocked(false)
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            successMessage="The user was blocked"
            failureMessage="The user could not be blocked"
            buttonText={isBlocked ? 'Unblock' : 'Block'}
            icon={
              !hover ? (
                <BlockedIcon width="30px" fill="red" />
              ) : (
                <ViewIcon width="30px" stroke="white" />
              )
            }
            disabled={me?.id === member?.id}
            {...props}
          >
            <Text>Are you sure you want to unblock {member?.nickname}?</Text>
          </ButtonConfirm>
        )) || (
          <ButtonConfirm
            size={size}
            color={mutual ? 'yellow' : 'white'}
            alertTitle={`Block ${member?.nickname || 'this member'}`}
            title={`Block ${member?.nickname || 'this member'}`}
            variant="secondary"
            _hover={{ bg: 'primary.500' }}
            promise={() => postJSON(`/api/members/${member.id}/block`, {})}
            complete={() => {
              setIsBlocked(true)
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            successMessage="The user was blocked"
            failureMessage="The user could not be blocked"
            buttonText={isBlocked ? 'Unblock' : 'Block'}
            icon={
              hover ? (
                <BlockedIcon width="30px" fill="red" />
              ) : (
                <ViewIcon width="30px" stroke="white" />
              )
            }
            disabled={me?.id === member?.id}
            {...props}
          >
            <Text>
              Are you sure you want to block {member?.nickname}? They will not
              be able to see you in the directory or view your profile. They
              will see your avatar on the event page.
            </Text>
          </ButtonConfirm>
        )}
      </>
    )
  }
)

import { useCallback, useEffect, useState } from 'react'

import { UpgradeIcon } from 'components/controls'
import { useUser } from 'hooks'
import {
  Member,
  MemberLevel,
  MembershipType,
  User,
  UserBuddy
} from 'lib/models'
import { deleteJSON, postJSON } from 'lib/utils'

import { chakra, IconButton, IconButtonProps } from '@chakra-ui/react'
import {
  UserIcon,
  UserMinusIcon as RemoveBuddyIcon
} from '@heroicons/react/24/outline'
import {
  UserIcon as BuddyIcon,
  UserPlusIcon as AddBuddyIcon
} from '@heroicons/react/24/solid'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member>
}

export const MemberConnect = chakra(
  ({ member, size = ['sm', 'md', 'lg'], ...props }: Props) => {
    const {
      loading: userLoading,
      member: me,
      level,
      reload,
      hasFeature
    } = useUser()
    const [hover, setHover] = useState(false)
    const [isBuddy, setIsBuddy] = useState<boolean | undefined>(undefined)

    const toggleBuddy = useCallback(() => {
      setIsBuddy(!isBuddy)
      if (isBuddy) {
        // remove buddy

        deleteJSON(`/api/members/${member?.id}/buddy`).then(() => {
          setIsBuddy(false)
          return reload()
        })
      } else {
        // add buddy
        postJSON<Partial<UserBuddy>>(
          `/api/members/${member?.id}/buddy`,
          {}
        ).then(() => {
          setIsBuddy(true)
          return reload()
        })
      }
    }, [isBuddy, member?.id, reload, setIsBuddy])

    useEffect(() => {
      if (!userLoading && me?.buddies && isBuddy == undefined) {
        const buddies = me.buddies as UserBuddy[]
        setIsBuddy(
          buddies.some((ur: UserBuddy) => {
            let buddy = ur.buddy_id as User
            return buddy?.id === member?.id || ur.buddy_id === member?.id
          })
        )
      }
    }, [isBuddy, me, member?.id, userLoading])

    if (level < MemberLevel.brother) return null
    if (userLoading || isBuddy == undefined) return null
    if (me?.id === member?.id) return null

    if (!hasFeature('buddy_list'))
      return (
        <UpgradeIcon
          title="Add Buddy"
          membershipType={MembershipType.basic}
          icon={<UserIcon width="30px" />}
          _hover={{ bg: 'primary.500' }}
          size={size}
        />
      )
    return (
      <>
        {(isBuddy && (
          <IconButton
            icon={
              hover ? (
                <RemoveBuddyIcon width="30px" stroke="white" />
              ) : (
                <BuddyIcon width="30px" fill={'yellow'} />
              )
            }
            onMouseOver={() => {
              setHover(true)
            }}
            onMouseOut={() => {
              setHover(false)
            }}
            variant="ghost"
            cursor="pointer"
            onClick={toggleBuddy}
            title={`Remove ${member?.nickname || 'this member'} as a Buddy`}
            aria-label={`Remove ${
              member?.nickname || 'this member'
            } as a Buddy`}
            size={size}
            color="white"
            _hover={{ bg: 'primary.500' }}
            {...props}
          />
        )) || (
          <IconButton
            icon={
              hover ? (
                <AddBuddyIcon width="30px" fill={'white'} />
              ) : (
                <UserIcon width="30px" stroke="white" />
              )
            }
            onMouseOver={() => {
              setHover(true)
            }}
            onMouseOut={() => {
              setHover(false)
            }}
            variant="ghost"
            aria-label={`Add ${member?.nickname || 'this member'} as a Buddy`}
            title={`Add ${member?.nickname || 'this member'} as a Buddy`}
            cursor="pointer"
            onClick={toggleBuddy}
            color="white"
            size={size}
            _hover={{ bg: 'primary.500' }}
            {...props}
          />
        )}
      </>
    )
  }
)

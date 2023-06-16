import { useCallback, useEffect, useState } from 'react'

import { UpgradeIcon } from 'components/controls'
import { useUser } from 'hooks'
import {
  Member,
  MemberLevel,
  MembershipType,
  User,
  UserBuddy
} from '@lib/models'
import { deleteJSON, postJSON } from '@lib/utils'

import { chakra, IconButton, IconButtonProps } from '@chakra-ui/react'
import {
  UserIcon,
  UserMinusIcon as BuddyIconMinus
} from '@heroicons/react/24/outline'
import { UserIcon as BuddyIcon, UserPlusIcon } from '@heroicons/react/24/solid'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Member | { id: string }
}

export const MemberConnect = chakra(
  ({ member, size = 'lg', ...props }: Props) => {
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

        deleteJSON(`/api/member/buddy/${member?.id}`).then(() => {
          setIsBuddy(false)
          return reload()
        })
      } else {
        // add buddy
        postJSON<Partial<UserBuddy>>(
          `/api/member/buddy/${member?.id}`,
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
        const b = buddies.some((ur: UserBuddy) => {
          return ur.buddy_id === member?.id
        })
        setIsBuddy(b)
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
        />
      )
    return (
      <>
        {(isBuddy && (
          <IconButton
            icon={
              hover ? (
                <BuddyIconMinus stroke={'white'} width="30px" fill={'white'} />
              ) : (
                <BuddyIcon width="30px" fill={'white'} />
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
            title="Remove Buddy"
            aria-label="Remove Buddy"
            size={size}
            _hover={{ bg: 'primary.500' }}
            {...props}
          />
        )) || (
          <IconButton
            icon={
              hover ? (
                <UserPlusIcon fill={'white'} width="30px" />
              ) : (
                <UserIcon stroke={'white'} width="30px" />
              )
            }
            onMouseOver={() => {
              setHover(true)
            }}
            onMouseOut={() => {
              setHover(false)
            }}
            variant="ghost"
            aria-label="Add Buddy"
            title="Add Buddy"
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

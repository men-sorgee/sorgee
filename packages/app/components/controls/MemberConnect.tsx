import { IconButton, IconButtonProps, chakra } from '@chakra-ui/react'
import { UserIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { UserIcon as BuddyIcon, UserMinusIcon as BuddyIconMinus } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { useUser } from 'hooks'
import { deleteJSON, postJSON } from 'lib/utils'
import { Member, MemberLevel, SearchableMember, UserBuddy } from 'lib/models'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member | SearchableMember>
}

export const MemberConnect = chakra(({ member, size = 'lg', ...props }: Props) => {
  const { loading: userLoading, member: me, level, reload } = useUser()
  const [hover, setHover] = useState(false)
  const [isBuddy, setIsBuddy] = useState<boolean | undefined>(undefined)

  const toggleBuddy = () => {
    if (isBuddy) {
      // remove buddy
      deleteJSON(`/api/member/buddy/${member.id}`).then(() => {
        setIsBuddy(false)
        return reload()
      })
    } else {
      // add buddy
      postJSON<Partial<UserBuddy>>(`/api/member/buddy/${member.id}`, {}).then(() => {
        setIsBuddy(true)
        return reload()
      })
    }
    setIsBuddy(!isBuddy)
  }

  useEffect(() => {
    if (!userLoading && me && isBuddy == undefined && me.buddies) {
      const buddies = me.buddies as UserBuddy[]
      const b = buddies.some((ur: UserBuddy) => ur.buddy_id === member.id)
      setIsBuddy(b)
    }
  }, [isBuddy, me, member.id, userLoading])

  if (level < MemberLevel.brother) return <></>
  if (userLoading || isBuddy == undefined) return <></>
  if (me?.id === member.id) return <></>
  return (
    <>
      {(isBuddy && (
        <IconButton
          color="white"
          icon={hover ? <BuddyIconMinus width="30px" /> : <BuddyIcon width="30px" />}
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
          {...props}
        />
      )) || (
        <IconButton
          icon={hover ? <UserPlusIcon width="30px" /> : <UserIcon width="30px" />}
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
          {...props}
        />
      )}
    </>
  )
})

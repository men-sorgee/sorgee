import { IconButton, IconButtonProps, chakra } from '@chakra-ui/react'
import { UserIcon, UserMinusIcon as BuddyIconMinus } from '@heroicons/react/24/outline'
import { UserIcon as BuddyIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { useUser } from 'hooks'
import { deleteJSON, postJSON } from 'lib/utils'
import { MemberLevel, User, UserBuddy } from 'lib/models'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  memberId: string
}

export const MemberConnect = chakra(({ memberId, size = 'lg', ...props }: Props) => {
  const { loading: userLoading, member: me, level, reload } = useUser()
  const [hover, setHover] = useState(false)
  const [isBuddy, setIsBuddy] = useState<boolean | undefined>(undefined)

  const toggleBuddy = () => {
    if (isBuddy) {
      // remove buddy
      deleteJSON(`/api/member/buddy/${memberId}`).then(() => {
        setIsBuddy(false)
        return reload()
      })
    } else {
      // add buddy
      postJSON<Partial<UserBuddy>>(`/api/member/buddy/${memberId}`, {}).then(() => {
        setIsBuddy(true)
        return reload()
      })
    }
    setIsBuddy(!isBuddy)
  }

  useEffect(() => {
    if (!userLoading && me?.buddies) {
      const buddies = me.buddies as UserBuddy[]
      const b = buddies.some((ur: UserBuddy) => {
        const buddy = ur.buddy_id as User
        return buddy.id === memberId
      })
      setIsBuddy(b)
    }
  }, [isBuddy, me, memberId, userLoading])

  if (level < MemberLevel.brother) return <></>
  if (userLoading || isBuddy == undefined) return <></>
  if (me?.id === memberId) return <></>
  return (
    <>
      {(isBuddy && (
        <IconButton
          color={hover ? 'white' : 'accent.300'}
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
          _hover={{ bg: 'primary.500' }}
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
          _hover={{ bg: 'primary.500' }}
          {...props}
        />
      )}
    </>
  )
})

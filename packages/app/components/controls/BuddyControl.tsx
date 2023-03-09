import { Stack, IconButton, Badge } from '@chakra-ui/react'
import { UserIcon, UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { useUser } from 'hooks'
import { deleteJSON, getJSON, postJSON } from '../../lib/utils'
import { UserRelationship } from '../../lib/models'

export const BuddyControl = ({ memberId }: { memberId: string }) => {
  const { loading, member: me, reload } = useUser()
  const [isBuddy, setIsBuddy] = useState<boolean>(undefined)
  const [hover, setHover] = useState(false)
  const toggleBuddy = () => {
    if (isBuddy) {
      // remove buddy
      deleteJSON(`/api/member/relationship/${memberId}`).then(() => {
        setIsBuddy(false)
        return reload()
      })
    } else {
      // add buddy
      postJSON<Partial<UserRelationship>>(`/api/member/relationship/${memberId}`, {
        relation: 'buddy',
      }).then(() => {
        setIsBuddy(true)
        return reload()
      })
    }
    setIsBuddy(!isBuddy)
  }
  //useEffect(() => {
  //  getJSON<UserRelationship>(`/api/member/relationship/${memberId}`).then(({ data }) => {
  //    setIsBuddy(data.relation == 'buddy')
  //  })
  //  // eslint-disable-next-line react-hooks/exhaustive-deps
  //}, [])

  useEffect(() => {
    if (!loading && me && isBuddy == undefined) {
      const b = me.users.find((ur) => ur.users_id === memberId && ur.relation == 'buddy')
      setIsBuddy(b != undefined)
    }
  }, [isBuddy, loading, me, memberId])
  return (
    <>
      <Stack isInline position="relative">
        {(isBuddy && (
          <IconButton
            color="primary.800"
            icon={hover ? <UserMinusIcon /> : <UserIcon />}
            onMouseOver={() => {
              setHover(true)
            }}
            onMouseOut={() => {
              setHover(false)
            }}
            variant="ghost"
            aria-label="Add to buddy-list"
            cursor="pointer"
            onClick={toggleBuddy}
            title="Remove Buddy"
          ></IconButton>
        )) || (
          <IconButton
            icon={<UserPlusIcon />}
            variant="ghost"
            title="Add Buddy"
            aria-label="Add to buddy-list"
            cursor="pointer"
            onClick={toggleBuddy}
            color="primary.400"
          ></IconButton>
        )}
      </Stack>
    </>
  )
}

import { Stack, IconButton, Badge } from '@chakra-ui/react'
import { UserIcon, UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useUser } from 'hooks'
import { deleteJSON, getJSON, postJSON } from 'lib/utils'
import { Member, SearchableMember, UserRelationship } from 'lib/models'

type Props = {
  member: Partial<Member | SearchableMember>
}

export const MemberConnect = ({ member }: Props) => {
  const { loading, member: me, reload } = useUser()
  const [isBuddy, setIsBuddy] = useState<boolean>(undefined)
  const [hover, setHover] = useState(false)
  const toggleBuddy = () => {
    if (isBuddy) {
      // remove buddy
      deleteJSON(`/api/member/relationship/${member.id}`).then(() => {
        setIsBuddy(false)
        return reload()
      })
    } else {
      // add buddy
      postJSON<Partial<UserRelationship>>(`/api/member/relationship/${member.id}`, {
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
      const b = me.users.find((ur) => ur.users_id === member?.id && ur.relation == 'buddy')
      setIsBuddy(b != undefined)
    }
  }, [isBuddy, loading, me, member?.id])
  return (
    <>
      {(isBuddy && (
        <IconButton
          color="white"
          icon={hover ? <UserMinusIcon width="30px" /> : <UserIcon width="30px" />}
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
          icon={hover ? <UserPlusIcon height="30px" /> : <UserIcon height="30px" />}
          onMouseOver={() => {
            setHover(true)
          }}
          onMouseOut={() => {
            setHover(false)
          }}
          variant="ghost"
          title="Add Buddy"
          aria-label="Add to buddy-list"
          cursor="pointer"
          onClick={toggleBuddy}
          color="white"
        ></IconButton>
      )}
    </>
  )
}

import {  IconButton, IconButtonProps, chakra } from '@chakra-ui/react'
import { HeartIcon as LikeIcon } from '@heroicons/react/24/outline'
import { HeartIcon as LikedIcon } from '@heroicons/react/24/solid'
import { useCallback, useEffect, useState } from 'react'
import { useUser, useMember } from 'hooks'
import { deleteJSON, postJSON } from 'lib/utils'
import { UpgradeIcon } from 'components/controls'
import { MembershipType, Member, SearchableMember } from 'lib/models'


type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member | SearchableMember>
}

export const MemberLike = chakra(({ member, size = 'lg', ...props }: Props) => {
  const { loading, member: me, reload, hasFeature } = useUser()
 
  const [isLiked, setIsLiked] = useState<boolean>(false)

  const toggleLike = useCallback(() => {
    if (isLiked) {
      deleteJSON(`/api/member/like/${member.id}`).then(() => {
        setIsLiked(false)
        return reload()
      })
    } else {
      // add buddy
      postJSON(`/api/member/like/${member.id}`, {}).then((r) => {
        setIsLiked(true)
        return reload()
      })
    }
  }, [isLiked, member.id, reload])

  useEffect(() => {
    const likes = me?.likes || []
    if (!loading && likes.length > 0) {
      setIsLiked(likes.some(l=> l.like_id == member.id))
    }
  }, [me, member.id, loading])


  if (loading || !me || me.id == member.id)
    return null
  
  const label = isLiked ? "Unlike" : "Like"

  if (!hasFeature('flirt')) return <UpgradeIcon
    title={label}
    membershipType={MembershipType.Plus}
    icon={<LikeIcon width="30px" />}
  />

  return (
    <>
      <IconButton
        size={size}
        color="white"
        title={label}
        aria-label={label}
        icon={isLiked ? <LikedIcon width="30px" />: <LikeIcon width="30px" />}
        variant="ghost"
        _hover={{ bg: 'primary.500' }}
        onClick={toggleLike}
        {...props}
      />
    </>
  )
})

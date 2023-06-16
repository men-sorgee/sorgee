import { useCallback, useEffect, useState } from 'react'

import { UpgradeIcon } from 'components/controls'
import { useUser } from 'hooks'
import {
  Member,
  MemberLevel,
  MembershipType,
  SearchableMember
} from '@lib/models'
import { deleteJSON, postJSON } from '@lib/utils'

import { chakra, IconButton, IconButtonProps } from '@chakra-ui/react'
import { StarIcon as LikeIcon } from '@heroicons/react/24/outline'
import { FireIcon, StarIcon as LikedIcon } from '@heroicons/react/24/solid'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member | SearchableMember>
}

export const MemberLike = chakra(({ member, size = 'lg', ...props }: Props) => {
  const { loading, member: me, reload, hasFeature, level } = useUser()

  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [mutual, setMutual] = useState<boolean>(false)

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
    const likedBy = me?.liked_by || []
    if (!loading && likes.length > 0) {
      setIsLiked(likes.some((l) => l.like_id == member.id))
    }
    if (!loading && likes.length > 0) {
      setMutual(likedBy.some((l) => l.user_id == member.id))
    }
  }, [me, member.id, loading])

  if (loading || !me || me.id == member.id) return null
  if (level < MemberLevel.brother) return null

  const label = mutual ? 'Match!' : isLiked ? 'Liked' : 'Like'

  if (!hasFeature('flirt'))
    return (
      <UpgradeIcon
        title={label}
        membershipType={MembershipType.plus}
        icon={<LikeIcon width="30px" />}
      />
    )

  return (
    <>
      <IconButton
        size={size}
        color={mutual ? 'yellow' : 'white'}
        title={label}
        aria-label={label}
        icon={
          mutual ? (
            <FireIcon width="30px" />
          ) : isLiked ? (
            <LikedIcon width="30px" />
          ) : (
            <LikeIcon width="30px" />
          )
        }
        variant="ghost"
        _hover={{ bg: 'primary.500' }}
        onClick={toggleLike}
        {...props}
      />
    </>
  )
})

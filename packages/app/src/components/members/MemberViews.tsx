import { UpgradeIcon } from "components";
import { useUser } from "hooks";
import { Member, MemberLevel, MembershipType } from "lib/models";
import { deleteJSON, postJSON } from "lib/utils/apis";
import { useCallback, useEffect, useState } from "react";

import { chakra, IconButton, IconButtonProps } from "@chakra-ui/react";
import { HandThumbUpIcon as LikeIcon } from "@heroicons/react/24/outline";
import {
  FireIcon,
  HandThumbUpIcon as LikedIcon
} from "@heroicons/react/24/solid";

export type MemberLikeProps = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member>
}

export const MemberLike = chakra(
  ({ member, size = ['sm', 'md', 'lg'], ...props }: MemberLikeProps) => {
    const { loading, member: me, reload, hasFeature, level } = useUser()
    const [hover, setHover] = useState(false)
    const [showLike, setShowLike] = useState(false)
    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [mutual, setMutual] = useState<boolean>(false)

    const toggleLike = useCallback(() => {
      if (isLiked) {
        setIsLiked(false)
        setMutual(false)
        return deleteJSON(`/api/members/${member?.id}/like`)
      } else {
        setIsLiked(true)
        return postJSON(`/api/members/${member?.id}/like`, {})
      }
    }, [isLiked, member?.id])

    useEffect(() => {
      const likes = me?.likes || []
      const likedBy = me?.liked_by || []
      if (!loading && likes?.length > 0) {
        setIsLiked(likes.some((l) => l?.like_id == member?.id))
      }
      if (!loading && likes.length > 0) {
        setMutual(likedBy.some((l) => l?.user_id == member?.id))
      }
    }, [me, member?.id, loading])

    const label = mutual
      ? `Mutual Like with ${member?.nickname}`
      : isLiked
        ? `Unlike ${member?.nickname}`
        : `Like ${member?.nickname}`

    // SWAP BETWEEN LIKED AND HOVER
    useEffect(() => {
      setShowLike(isLiked ? !hover : hover)
    }, [hover, isLiked, mutual])

    if (loading || !me) return null
    if (level < MemberLevel.brother) return null

    if (!hasFeature('flirt'))
      return (
        <UpgradeIcon
          title={label}
          membershipType={MembershipType.plus}
          icon={<LikeIcon width="30px" />}
          _hover={{ bg: 'primary.500' }}
          size={size}
        />
      )

    return (
      <>
        <IconButton
          size={size}
          color={mutual || isLiked ? 'yellow' : 'white'}
          title={label}
          aria-label={label}
          icon={
            showLike ? (
              mutual ? (
                <FireIcon width="30px" />
              ) : (
                <LikedIcon width="30px" />
              )
            ) : (
              <LikeIcon width="30px" stroke="white" />
            )
          }
          variant="ghost"
          _hover={{ bg: 'primary.500' }}
          onClick={() => {
            if (me?.id === member?.id) return
            return toggleLike()
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disabled={me?.id === member?.id}
          {...props}
        />
      </>
    )
  }
)

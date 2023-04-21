import { IconButton, Badge, Text, IconButtonProps, chakra } from '@chakra-ui/react'
import { useMember, useMessages, useUser } from 'hooks'
import { ChatBubbleBottomCenterIcon as ChatIconOff } from '@heroicons/react/24/outline'
import { ChatBubbleBottomCenterIcon as ChatIconOn } from '@heroicons/react/24/solid'
import { MemberLevel, SearchableMember, User, UserBuddy, Member } from 'lib/models'
import { useEffect, useState } from 'react'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member | SearchableMember>
}

export const MemberChat = chakra(({ member, size = 'lg', ...props }: Props) => {
  const { loading: userLoading, level, member: me } = useUser()
  const { member: them, loading: memberLoading } = useMember(member.id)
  const { conversations, chatWith, loading } = useMessages()
  const [hasConversation, setHasConversation] = useState<boolean>(undefined)
  const [newMessageCount, setNewMessageCount] = useState<number>(undefined)
  const [hasNewMessages, setHasNewMessages] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (conversations[member?.id] != undefined && hasConversation == undefined) {
        setHasConversation(true)
        const newMessages = conversations[member.id].messages?.filter(
          (m) => m.direction == 'incoming' && m.status == 'new'
        )
        setNewMessageCount(newMessages.length)
        setHasNewMessages(newMessages.length > 0)
      }
    }
  }, [conversations, hasConversation, loading, member.id])

  if (loading || userLoading || level < MemberLevel.brother) return <></>
  if (me?.id === member.id) return <></>
  if (me?.allow_messages == 'staff' && them?.user_type != 'staff') return <></>
  if (them?.allow_messages == 'staff' && me?.user_type != 'staff') return <></>
  if (them?.allow_messages == 'buddies' && them?.buddies) {
    const memberBuddies = them?.buddies as UserBuddy[]
    if (
      !memberBuddies?.some((b: UserBuddy) => {
        return b.buddy_id == me.id
      })
    )
      return <></>
  }

  return (
    <>
      <IconButton
        variant="ghost"
        zIndex="fixed"
        color="white"
        onClick={() => {
          chatWith(member)
        }}
        aria-label={`Chat with ${member.nickname || 'this member'}`}
        title={`Chat with ${member.nickname || 'this member'}`}
        icon={hasConversation ? <ChatIconOn width="30px" /> : <ChatIconOff width="30px" />}
        size={size}
        {...props}
      />
      {hasNewMessages && (
        <Badge
          bg="red"
          color="white"
          ml={-4}
          zIndex="overlay"
          position="absolute"
          rounded="full"
          px={2}
          py={0.5}
        >
          {newMessageCount}
        </Badge>
      )}
    </>
  )
})

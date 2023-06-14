import { IconButton, Badge, IconButtonProps, chakra } from '@chakra-ui/react'
import { useMember, useMessages, useUser } from 'hooks'
import { ChatBubbleBottomCenterIcon as ChatIconOff } from '@heroicons/react/24/outline'
import { ChatBubbleBottomCenterIcon as ChatIconOn } from '@heroicons/react/24/solid'
import { MemberLevel, SearchableMember, UserBuddy, Member, MembershipType } from 'lib/models'
import { useEffect, useState } from 'react'
import { UpgradeIcon } from 'components/controls'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member | SearchableMember>
}

export const MemberChat = chakra(({ member, size = 'lg', ...props }: Props) => {
  const { loading: userLoading, level, member: me, hasFeature } = useUser()
  const { member: them, name, loading: memberLoading } = useMember(member.id)
  const { conversations, chatWith, loading } = useMessages()
  const [hasConversation, setHasConversation] = useState<boolean>(undefined)
  const [newMessageCount, setNewMessageCount] = useState<number>(undefined)
  const [hasNewMessages, setHasNewMessages] = useState(false)

  useEffect(() => {
    if (!loading) {
      const convo = conversations?.find(c => c.id == member?.id)
      if (convo && hasConversation == undefined) {
        setHasConversation(true)
        const newMessages = convo.messages?.filter(
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

  if (me?.id != them?.vouched_by && !hasFeature('chat')) return <UpgradeIcon
    title={`Chat with ${name}`}
    membershipType={MembershipType.Plus}
    icon={<ChatIconOff width="30px" />}
  />

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
        _hover={{ bg: 'primary.500' }}
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

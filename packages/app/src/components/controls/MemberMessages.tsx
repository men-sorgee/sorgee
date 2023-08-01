import { useEffect, useState } from 'react'

import { UpgradeIcon } from 'components/controls'
import { useMember, useMessages, useUser } from 'hooks'
import {
  Member,
  MemberLevel,
  MembershipType,
  User,
  UserBuddy
} from 'lib/models'

import { Badge, chakra, IconButton, IconButtonProps } from '@chakra-ui/react'
import { ChatBubbleBottomCenterIcon as ChatIconOff } from '@heroicons/react/24/outline'
import { ChatBubbleBottomCenterIcon as ChatIconOn } from '@heroicons/react/24/solid'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member>
}

export const MemberMessages = chakra(
  ({ member, size = ['sm', 'md', 'lg'], ...props }: Props) => {
    const { loading: userLoading, level, member: me, hasFeature } = useUser()
    const { member: them, name, loading: memberLoading } = useMember(member.id)
    const { conversations, chatWith, loading } = useMessages()
    const [hasConversation, setHasConversation] = useState<boolean>(undefined)
    const [newMessageCount, setNewMessageCount] = useState<number>(undefined)
    const [hasNewMessages, setHasNewMessages] = useState(false)
    const [hover, setHover] = useState(false)

    useEffect(() => {
      if (!loading && !memberLoading) {
        const convo = conversations?.find((c) => c.id == member?.id)
        if (convo && hasConversation == undefined) {
          setHasConversation(true)
          const newMessages = convo.messages?.filter(
            (m) => m.direction == 'incoming' && m.status == 'new'
          )
          setNewMessageCount(newMessages.length)
          setHasNewMessages(newMessages.length > 0)
        }
      }
    }, [conversations, hasConversation, loading, member?.id, memberLoading])

    if (loading || userLoading || level < MemberLevel.brother) return <></>
    if (me?.id === member.id) return <></>
    if (me?.allow_messages == 'staff' && them?.user_type != 'staff')
      return <></>
    if (them?.allow_messages == 'staff' && me?.user_type != 'staff')
      return <></>
    if (them?.allow_messages == 'buddies' && them?.buddies) {
      const memberBuddies = them?.buddies as UserBuddy[]
      if (
        !memberBuddies?.some((b: UserBuddy) => {
          return b.buddy_id == me.id
        })
      )
        return <></>
    }

    if (
      member.user_type !== 'pledge' &&
      me?.id != them?.vouched_by?.id &&
      !hasFeature('chat')
    )
      return (
        <UpgradeIcon
          title={`Chat with ${name}`}
          membershipType={MembershipType.plus}
          icon={<ChatIconOff width="30px" />}
          size={size}
          _hover={{ bg: 'primary.500' }}
        />
      )

    return (
      <div style={{ position: 'relative' }}>
        <IconButton
          variant="ghost"
          icon={
            hasConversation ? (
              <ChatIconOn width="30px" color="yellow" />
            ) : hover ? (
              <ChatIconOn width="30px" />
            ) : (
              <ChatIconOff width="30px" />
            )
          }
          position="relative"
          color="white"
          onClick={() => {
            chatWith(member as Member)
          }}
          aria-label={`Chat with ${member.nickname || 'this member'}`}
          title={`Chat with ${member.nickname || 'this member'}`}
          size={size}
          _hover={{ bg: 'primary.500' }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          {...props}
        />
        {hasNewMessages && (
          <Badge
            bg="red"
            fontSize=".7rem"
            color="white"
            zIndex="overlay"
            rounded="full"
            position="absolute"
            ml={-5}
            mt={2}
            px={1}
          >
            {newMessageCount}
          </Badge>
        )}
      </div>
    )
  }
)

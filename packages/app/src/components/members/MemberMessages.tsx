import { UpgradeIcon } from "components";
import { useMessages, useUser } from "hooks";
import {
  Member,
  MemberLevel,
  MembershipType,
  SearchableMember,
  UserBuddy
} from "lib/models";
import { memo, useEffect, useState } from "react";

import { Badge, chakra, IconButton, IconButtonProps } from "@chakra-ui/react";
import { ChatBubbleBottomCenterIcon as ChatIconOff } from "@heroicons/react/24/outline";
import { ChatBubbleBottomCenterIcon as ChatIconOn } from "@heroicons/react/24/solid";

export type MemberMessagesProps = Omit<IconButtonProps, 'aria-label'> & {
  member: SearchableMember | Partial<Member>
}

export const MemberMessages = memo(chakra(
  function MemberMessages({ member: them, size = ['sm', 'md', 'lg'], ...props }: MemberMessagesProps) {
    const { loading: userLoading, level, member: me, hasFeature } = useUser()
    const theirLevel = MemberLevel[them?.user_type || 'pledge']
    //const { member: them, name, loading: memberLoading } = useMember(member.id)
    const { conversations, chatWith, loading } = useMessages()
    const [hasConversation, setHasConversation] = useState<boolean>(undefined)
    const [newMessageCount, setNewMessageCount] = useState<number>(undefined)
    const [hasNewMessages, setHasNewMessages] = useState(false)
    const [hover, setHover] = useState(false)

    useEffect(() => {
      if (!loading && !userLoading && me && them) {
        const convo = conversations?.find((c) => c.id == them?.id)
        if (convo && hasConversation == undefined) {
          setHasConversation(true)
          const newMessages = convo.messages?.filter(
            (m) => m.direction == 'incoming' && m.status == 'new'
          )
          setNewMessageCount(newMessages.length)
          setHasNewMessages(newMessages.length > 0)
        }
      }
    }, [conversations, hasConversation, loading, me, them, userLoading])

    if (loading || userLoading || level < MemberLevel.brother) return <></>

    if (me?.allow_messages == 'staff' && theirLevel != MemberLevel.staff) return <></>
    if (them?.allow_messages == 'staff' && level != MemberLevel.staff) return <></>
    if (them?.allow_messages == 'buddies' && them?.buddies) {

      const memberBuddies = them?.buddies as UserBuddy[]
      if (
        !memberBuddies?.some((b: UserBuddy) => {
          return b.buddy_id == me.id
        }) && level != MemberLevel.staff
      )
        return <></>
    }

    if (theirLevel !== MemberLevel.pledge && me?.id != them?.vouched_by?.id && !hasFeature('chat'))
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

      <IconButton
        variant="ghost"
        position='relative'
        icon={
          hasConversation ? (
            <ChatIconOn width="30px" color="yellow" />
          ) : hover ? (
            <ChatIconOn width="30px" />
          ) : (
            <ChatIconOff width="30px" />
          )
        }
        color="white"
        onClick={() => {
          if (them?.id == me?.id) return
          chatWith(them as Member)
        }}
        aria-label={`Chat with ${them?.nickname || 'this member'}`}
        title={`Chat with ${them?.nickname || 'this member'}`}
        size={size}
        _hover={{ bg: 'primary.500' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        px={[.1, .5]}
        disabled={me?.id === them?.id}
        {...props}
      >
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
      </IconButton>

    )
  }
), (prev, next) => (prev.member?.id == next.member?.id && prev.size == next.size))

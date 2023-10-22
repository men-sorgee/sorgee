import { UpgradeIcon } from "components";
import { useMessages } from "hooks";
import { Member, MemberLevel, MembershipType } from "lib/models";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";

import { Badge, Icon, IconButton, Link } from "@chakra-ui/react";
import { ChatBubbleBottomCenterIcon as ChatIcon } from "@heroicons/react/24/outline";

type Props = {
  member: Member
  hasFeature: boolean
  active: boolean
  iconSize?: string[]
  iconDimensions?: string[]
}

const ChatActions = ({
  member,
  hasFeature,
  active,
  iconSize,
  iconDimensions
}: Props) => {
  const {
    conversations,
    hasNewMessages,
    newMessageCount,
    activeId,
    setActiveId,
    lastActiveId
  } = useMessages()

  const [prevMessagesCount, setPrevMessagesCount] = useState<number>(undefined)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (prevMessagesCount == undefined) {
      setPrevMessagesCount(newMessageCount)
    }
    if (newMessageCount > prevMessagesCount) {
      audioRef.current?.play()
      setPrevMessagesCount(newMessageCount)
    }
  }, [newMessageCount, prevMessagesCount])

  const level = MemberLevel[member.user_type]

  const ActionIcon = () => (
    <Link
      href={`/member/messages${activeId ? '/' + activeId : ''}`}
      as={NextLink}
      zIndex="fixed"
    >
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />
      <IconButton
        aria-label="Brother Chat"
        title="Brother Chat"
        variant="primary"
        zIndex="fixed"
        w={iconDimensions}
        color={active ? 'accent.500' : 'white'}
        size={iconSize}
        icon={<Icon as={ChatIcon} w={iconDimensions} h={iconDimensions} />}

      />
      {hasNewMessages && (
        <Badge
          bg="white"
          color="black"
          ml={-4}
          zIndex="overlay"
          position="absolute"
          rounded="full"
          px={1.5}
          py={0.5}
          fontSize={10}
          title={`${newMessageCount} new messages`}
        >
          {newMessageCount}
        </Badge>
      )
      }
    </Link >
  )

  if (conversations?.length) return <ActionIcon />

  if (!hasFeature && level >= MemberLevel.brother)
    return (
      <UpgradeIcon
        size={iconSize}
        title="Brother Chat"
        membershipType={MembershipType.basic}
        icon={<Icon as={ChatIcon} w={iconDimensions} h={iconDimensions} />}
      />
    )

  if (!hasNewMessages && level < MemberLevel.brother) return null

  return <ActionIcon />
}

export default ChatActions

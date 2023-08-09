import { MemberAvatar } from "components";
import { useMessageStats } from "hooks";
import { MemberLevel } from "lib/models";
import { useEffect, useState } from "react";

import {
  Box,
  chakra,
  Flex,
  HStack,
  Icon,
  IconProps,
  Text
} from "@chakra-ui/react";
import { ChatBubbleBottomCenterIcon as ChatIconOn } from "@heroicons/react/24/solid";

export type MemberMessageStatsProps = Omit<IconProps, 'aria-label'> & {
  memberId: string
  viewerLevel?: MemberLevel
}

export const MemberMessageStats = chakra(
  ({ memberId, viewerLevel, boxSize = '20px', ...props }: MemberMessageStatsProps) => {
    const [showStats, setShowStats] = useState<boolean>(undefined)
    const [convoCount, setMessageCount] = useState<number>(undefined)
    const { stats, loading: statsLoading } = useMessageStats(memberId)

    useEffect(() => {
      if (!statsLoading && stats && showStats == undefined) {
        let count = stats.conversations.length
        setShowStats(true)
        setMessageCount(count)
      }
    }, [stats, setShowStats, showStats, statsLoading])

    if (!showStats) return null

    const message = `${convoCount} ${
      convoCount != 1 ? 'brothers have' : 'brother has'
    } chatted with him.`

    const color = convoCount > 0 ? 'primary.400' : 'primary.200'
    return (
      <Box bg={color} p={2} rounded="lg" mb={4} alignContent="right">
        <Flex align="center" gap={2}>
          <Icon
            as={ChatIconOn}
            color="white"
            aria-label={message}
            title={message}
            boxSize={boxSize}
            {...props}
          />

          <Text m={0} p={0}>
            {message}
          </Text>
        </Flex>

        {viewerLevel == MemberLevel.staff && convoCount > 0 && (
          <HStack align="middle" justifyContent="middle" mt={2}>
            {stats.conversations.map((c) => (
              <MemberAvatar
                key={c.id}
                size="sm"
                member={{
                  id: c.id,
                  nickname: c.name,
                  picture: c.picture,
                }}
                title={c.name}
              />
            ))}
          </HStack>
        )}
      </Box>
    )
  }
)

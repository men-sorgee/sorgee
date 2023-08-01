import { useEffect, useState } from 'react'
import { useMessageStats } from 'hooks'
import {
  Box,
  HStack,
  chakra,
  Icon,
  IconProps,
  Flex,
  Text
} from '@chakra-ui/react'
import { ChatBubbleBottomCenterIcon as ChatIconOn } from '@heroicons/react/24/solid'
import { MemberAvatar } from './MemberAvatar'
import { MemberLevel } from 'lib/models'

type Props = Omit<IconProps, 'aria-label'> & {
  memberId: string
  viewerLevel?: MemberLevel
}

export const MemberMessageStats = chakra(
  ({ memberId, viewerLevel, boxSize = '20px', ...props }: Props) => {
    const [showStats, setShowStats] = useState<boolean>(undefined)
    const [messageCount, setMessageCount] = useState<number>(undefined)

    const { stats, loading: statsLoading } = useMessageStats(memberId)

    useEffect(() => {
      if (!statsLoading && stats && showStats == undefined) {
        let count = stats.conversations.length
        setShowStats(true)
        setMessageCount(count)
      }
    }, [stats, setShowStats, showStats, statsLoading])

    if (!showStats) return null

    const message = `${messageCount} ${
      messageCount != 1 ? 'brothers have' : 'brother has'
    } chatted with him.`

    const color = messageCount > 0 ? 'primary.400' : 'red.400'
    return (
      <Box bg={color} p={2} rounded="lg" mb={4}>
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

        {viewerLevel == MemberLevel.staff && (
          <HStack align="middle" justify="middle" w="full" mt={2}>
            {stats.conversations.map((c) => (
              <MemberAvatar
                key={c.id}
                size="sm"
                member={{
                  id: c.id,
                  nickname: c.name,
                  picture: c.picture
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

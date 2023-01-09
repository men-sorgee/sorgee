import { HStack, Avatar, VStack, Heading, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useMember } from 'hooks/use-member'
import { UserBadge } from './UserBadge'
import { getAssetUrl } from '../../lib/utils'

export default function (_props) {
  const { member, loading } = useMember()
  const [photoSrc, setPhotoSrc] = useState<string | null>()
  useEffect(() => {
    if (!loading && member) {
      const { picture } = member
      if (!photoSrc && picture) setPhotoSrc(getAssetUrl(picture))
    }
  }, [member, photoSrc, loading])

  if (loading || !member) return null

  return (
    <>
      <HStack spacing={3} alignItems="center">
        <Avatar src={photoSrc} size="lg" color="white" bg="primary.300" title={member?.biography} />
        <VStack spacing={0} align="flex-start">
          <Heading size="md" textTransform="uppercase" m={0}>
            {member?.nickname}
          </Heading>
          <UserBadge size="lg" user_type={member?.user_type} />
          <Text fontSize="sm" color="gray.500">
            {member?.city}
          </Text>
        </VStack>
      </HStack>
    </>
  )
}

import { HStack, Avatar, VStack, Heading, Text, AvatarProps } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { UserBadge } from './'
import { getAssetUrl } from 'lib/utils'
import { Member } from '../../lib/models'

type Props = AvatarProps & {
  user: Partial<Member>
}

export default function UserCard({ user }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [pictureSrc, setPictureSrc] = useState<string | null>()

  useEffect(() => {
    if (!loaded && user) {
      const { picture } = user
      if (!pictureSrc && picture) setPictureSrc(getAssetUrl(picture))
      setLoaded(true)
    }
  }, [user, pictureSrc, loaded])

  if (!user) return null

  return (
    <>
      <HStack spacing={3} alignItems="center">
        <Avatar
          id={user?.id}
          src={pictureSrc}
          size="lg"
          color="white"
          bg="primary.300"
          name={user?.nickname || user?.first_name}
        />
        <VStack spacing={0} align="flex-start">
          <Heading size="md" textTransform="uppercase" m={0}>
            {user?.nickname || user?.first_name}
          </Heading>
          <UserBadge size="lg" user_type={user?.user_type} />
          <Text fontSize="sm" color="text">
            {user?.city}
          </Text>
        </VStack>
      </HStack>
    </>
  )
}

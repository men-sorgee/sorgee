import {
  HStack,
  Avatar,
  VStack,
  Heading,
  Text,
  AvatarProps,
  AvatarBadge,
  Tooltip,
  chakra,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { UserBadge } from './'
import { getAssetUrl, toLocaleDate } from 'lib/utils'
import { Member, SearchableMember } from 'lib/models'
import { formatDistanceToNowStrict } from 'date-fns'

type Props = AvatarProps & {
  user: Partial<Member | SearchableMember>
}

export const UserCard = chakra(({ user, size = 'lg', ...props }: Props) => {
  const [loaded, setLoaded] = useState(false)
  const [pictureSrc, setPictureSrc] = useState<string | null>(null)
  const [lastLogin, setLastLogin] = useState<string | null>(null)
  useEffect(() => {
    if (!loaded && user) {
      const picture = user.picture
      if (!pictureSrc && picture) setPictureSrc(getAssetUrl(picture))
      setLoaded(true)

      setLastLogin(
        user?.last_login
          ? `Last seen ${formatDistanceToNowStrict(toLocaleDate(user.last_login))} ago`
          : undefined
      )
    }
  }, [user, pictureSrc, loaded, lastLogin])

  return (
    <>
      {user && (
        <HStack spacing={3} alignItems="center">
          <Avatar
            id={user?.id}
            src={pictureSrc}
            size={size}
            color="white"
            name={user?.nickname || user?.first_name}
            bgGradient="linear(to-b, blue.500, accent.500)"
            loading="lazy"
            borderColor="accent.500"
            borderWidth="thin"
            {...props}
          >
            {user?.presence == 'online' && (
              <Tooltip label={lastLogin} placement="top">
                <AvatarBadge borderWidth="thin" boxSize=".75em" bg="green" title="Online" />
              </Tooltip>
            )}
          </Avatar>
          <VStack spacing={0} align="flex-start">
            <Heading size="md" textTransform="uppercase" m={0}>
              {user?.nickname || user?.first_name}
            </Heading>
            <UserBadge size="lg" user_type={user?.user_type} />
            <Text fontSize="sm" color="text">
              {user?.city || 'Nearby'} {user?.state}
            </Text>
          </VStack>
        </HStack>
      )}
    </>
  )
})

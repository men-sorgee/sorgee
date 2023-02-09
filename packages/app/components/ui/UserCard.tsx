import {
  HStack,
  Avatar,
  VStack,
  Heading,
  Text,
  AvatarProps,
  AvatarBadge,
  Tooltip,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { UserBadge } from './'
import { getAssetUrl } from 'lib/utils'
import { DirectusFile, Member } from 'lib/models'
import dynamic from 'next/dynamic'

type Props = AvatarProps & {
  user: Partial<Member>
}

export default function UserCard({ user }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [pictureSrc, setPictureSrc] = useState<string | null>(null)
  const [lastLogin, setLastLogin] = useState<string | null>(null)
  useEffect(() => {
    if (!loaded && user) {
      const picture = user.picture
      if (!pictureSrc && picture) setPictureSrc(getAssetUrl(picture))
      setLoaded(true)
      import('moment').then((m) => {
        let moment = m.default
        setLastLogin('Online since ' + user?.last_login ? moment(user?.last_login).fromNow() : '')
      })
    }
  }, [user, pictureSrc, loaded, lastLogin])

  return (
    <>
      {user && (
        <HStack spacing={3} alignItems="center">
          <Avatar
            id={user?.id}
            src={pictureSrc}
            size="lg"
            color="white"
            name={user?.nickname || user?.first_name}
            bgGradient="linear(to-b, blue.500, accent.500)"
          >
            {user?.presence == 'online' && (
              <Tooltip label={lastLogin} placement="top">
                <AvatarBadge boxSize="1em" bg="green.500" title="Online" />
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
}

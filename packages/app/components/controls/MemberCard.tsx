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
  useColorModeValue,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MemberBadge } from '.'
import { getAssetUrl, toLocalDate } from 'lib/utils'
import { Member, SearchableMember } from 'lib/models'
import { formatDistanceToNowStrict } from 'date-fns'
import { ImageModal } from './ImageModal'

type Props = AvatarProps & {
  zoom?: boolean
  color?: string
  user: Partial<Member | SearchableMember>
}

export const MemberCard = chakra(
  ({ zoom = false, user, size = 'lg', color = 'white', ...props }: Props) => {
    const [loaded, setLoaded] = useState(false)
    const [pictureSrc, setPictureSrc] = useState<string | null>(null)
    const [lastLogin, setLastLogin] = useState<string | null>(null)
    const textColor = useColorModeValue('gray.700', 'white')
    useEffect(() => {
      if (!loaded && user) {
        const picture = user.picture
        if (!pictureSrc && picture) setPictureSrc(getAssetUrl(picture))
        setLoaded(true)

        setLastLogin(
          user?.last_login
            ? `Last login ${formatDistanceToNowStrict(toLocalDate(user.last_login))} ago`
            : undefined
        )
      }
    }, [user, pictureSrc, loaded, lastLogin])

    const [isOpen, setOpen] = useState<boolean>(undefined)
    return (
      <>
        {user && (
          <HStack spacing={3} alignItems="center">
            <Avatar
              id={user?.id}
              src={pictureSrc}
              size={size}
              color={color}
              name={user?.nickname || user?.first_name}
              bgGradient="linear(to-b, primary.500, primary.800)"
              loading="lazy"
              borderColor="accent.500"
              borderWidth="thin"
              {...props}
              cursor="pointer"
              onClick={() => {
                if (zoom && pictureSrc) setOpen(true)
              }}
            >
              {user?.presence == 'online' && (
                <Tooltip label={lastLogin} placement="top">
                  <AvatarBadge borderWidth="thin" boxSize="1.5rem" bg="green.300" />
                </Tooltip>
              )}
            </Avatar>
            <ImageModal
              isOpen={isOpen}
              onClose={() => {
                setOpen(false)
              }}
              imageSrc={pictureSrc}
            />
            <VStack spacing={1} align="flex-start" mt={0}>
              <Heading size="md" textTransform="uppercase" m={0} color={color}>
                {user?.nickname || user?.first_name}
              </Heading>
              <MemberBadge size="lg" user_type={user?.user_type} my={2} />
              <Text fontSize="sm" color={color}>
                {user?.city || 'Nearby'} {user?.state}
              </Text>
            </VStack>
          </HStack>
        )}
      </>
    )
  }
)

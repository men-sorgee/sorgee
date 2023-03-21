import {
  HStack,
  Box,
  Avatar,
  VStack,
  Heading,
  Text,
  AvatarProps,
  AvatarBadge,
  Tooltip,
  chakra,
  useColorModeValue,
  Spacer,
  Flex,
} from '@chakra-ui/react'
import { useEffect, useState, ReactNode } from 'react'
import { MemberBadge } from '.'
import { getAssetUrl, toLocalDate } from 'lib/utils'
import { Member, SearchableMember } from 'lib/models'
import { formatDistanceToNowStrict } from 'date-fns'
import { ImageModal } from './ImageModal'

export type MemberCardProps = AvatarProps & {
  zoom?: boolean
  color?: string
  member: Partial<Member | SearchableMember>
  children?: ReactNode
}

export const MemberCard = chakra(
  ({
    zoom = false,
    member: user,
    size = 'lg',
    color = 'white',
    children,
    ...props
  }: MemberCardProps) => {
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
          <Flex gap={3} alignItems="center" w="full">
            <Avatar
              id={user?.id}
              src={`${pictureSrc}?width=100&height=100&quality=70`}
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
              imageSrc={`${pictureSrc}?quality=100`}
            />
            <Flex w="full" direction="column" gap={0} align="flex-start">
              <Heading size="md" textTransform="uppercase" m={0} color={color}>
                {user?.nickname || user?.first_name}
              </Heading>
              <Flex gap={1} align="flex-start" justify="space-between" w="full">
                <Box>
                  <MemberBadge size="lg" user_type={user?.user_type} my={2} />
                  <Text fontSize="sm" color={color} mt={0}>
                    {user?.city || 'Nearby'} {user?.state}
                  </Text>
                </Box>
                <Spacer flex={'grow'} />
                <Box>{children}</Box>
              </Flex>
            </Flex>
          </Flex>
        )}
      </>
    )
  }
)

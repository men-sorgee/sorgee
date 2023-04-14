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

export const MemberIcon = chakra(
  ({ member, zoom = false, size = 'lg', color = 'white', children, ...props }: MemberCardProps) => {
    const [lastLogin, setLastLogin] = useState<string | null>(null)

    useEffect(() => {
      if (member && !lastLogin) {
        setLastLogin(
          member?.last_login
            ? `Last login ${formatDistanceToNowStrict(toLocalDate(member.last_login))} ago`
            : undefined
        )
      }
    }, [member, lastLogin])

    const [isOpen, setOpen] = useState<boolean>(undefined)
    return (
      <>
        {member && (
          <Flex gap={3} alignItems="center" w="full">
            <Avatar
              id={member?.id}
              src={
                member?.picture
                  ? getAssetUrl(member?.picture) + '?width=100&height=100&quality=80'
                  : null
              }
              size={size}
              color={color}
              name={member?.nickname || member?.first_name}
              bgGradient="linear(to-b, primary.500, primary.800)"
              loading="lazy"
              borderColor="accent.500"
              borderWidth="thin"
              {...props}
              cursor={member?.picture ? 'pointer' : ''}
              onClick={() => {
                if (zoom && member?.picture) setOpen(true)
              }}
            >
              {member?.presence == 'online' && (
                <Tooltip label={lastLogin} placement="top">
                  <AvatarBadge borderWidth="thin" boxSize="1.5rem" bg="green.300" />
                </Tooltip>
              )}
            </Avatar>
            {member?.picture && (
              <ImageModal
                isOpen={isOpen}
                onClose={() => {
                  setOpen(false)
                }}
                imageSrc={`${getAssetUrl(member.picture)}?quality=100`}
              />
            )}
            <Flex w="full" direction="column" gap={0} align="flex-start">
              <Heading size="md" textTransform="uppercase" m={0} color={color}>
                {member?.nickname || member?.first_name}
              </Heading>
              <Flex gap={1} align="flex-start" justify="space-between" w="full">
                <Box>
                  <MemberBadge size="lg" user_type={member?.user_type} my={2} />
                  <Text fontSize="sm" color={color} mt={0}>
                    {member?.city || 'Nearby'} {member?.state}
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

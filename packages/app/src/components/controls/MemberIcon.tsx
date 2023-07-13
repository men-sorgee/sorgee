import { ReactNode, useEffect, useState } from 'react'

import { formatDistanceToNowStrict } from 'date-fns'
import { Member } from 'lib/models'
import { getAssetUrl, toLocalDate } from 'lib/utils'

import {
  Avatar,
  AvatarBadge,
  AvatarProps,
  Box,
  chakra,
  Flex,
  Heading,
  Spacer,
  Text,
  Tooltip
} from '@chakra-ui/react'

import { MemberBadge } from './'
import { ImageModal } from './ImageModal'

export type MemberIconProps = AvatarProps & {
  zoom?: boolean
  color?: string
  member: Partial<Member>
  children?: ReactNode
}

export const MemberIcon = chakra(
  ({
    member,
    zoom = false,
    size = 'lg',
    color = 'white',
    children,
    ...props
  }: MemberIconProps) => {
    const [lastLogin, setLastLogin] = useState<string | null>(null)

    useEffect(() => {
      if (member && !lastLogin) {
        setLastLogin(
          member?.last_login
            ? `Last login ${formatDistanceToNowStrict(
                toLocalDate(member.last_login)
              )} ago`
            : undefined
        )
      }
    }, [member, lastLogin])

    const [isOpen, setOpen] = useState<boolean>(undefined)
    return (
      <>
        {member && (
          <Flex gap={2} w="full" align="start">
            <Avatar
              id={member?.id}
              src={
                member?.picture
                  ? getAssetUrl(member?.picture) +
                    '?width=100&height=100&quality=80'
                  : null
              }
              size={size}
              color={color}
              name={member?.nickname || 'Brother'}
              bgGradient="linear(to-b, primary.500, primary.800)"
              loading="lazy"
              borderColor="accent.500"
              borderWidth="2px"
              cursor={member?.picture ? 'pointer' : ''}
              onClick={() => {
                if (zoom && member?.picture) setOpen(true)
              }}
              {...props}
            >
              {member?.presence == 'online' && (
                <Tooltip label={lastLogin} placement="top">
                  <AvatarBadge
                    borderWidth="thin"
                    boxSize="1.5rem"
                    bg="green.300"
                  />
                </Tooltip>
              )}
            </Avatar>

            <Flex w="full" direction="column" gap={1} textAlign="left">
              <Heading
                size={['md', 'lg']}
                textTransform="uppercase"
                noOfLines={1}
                m={0}
                color={color}
                w="full"
                title={member?.nickname || member.first_name}
              >
                {member?.nickname || member.first_name}
              </Heading>
              <Flex
                gap={4}
                direction="row"
                align="end"
                justify="space-between"
                w="full"
              >
                <Box>
                  <MemberBadge member={member} my={2} />
                  <Text fontSize="sm" color={color} mt={0}>
                    {member?.city} {member?.state}
                  </Text>
                </Box>

                <Spacer flex="grow" />
                <Box>{children}</Box>
              </Flex>
            </Flex>
            {zoom && member?.picture && (
              <ImageModal
                isOpen={isOpen}
                onClose={() => {
                  setOpen(false)
                }}
                imageSrc={`${getAssetUrl(member.picture)}?quality=100`}
              />
            )}
          </Flex>
        )}
      </>
    )
  }
)

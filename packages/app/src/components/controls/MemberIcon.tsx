import { ReactNode, useEffect, useState } from 'react'

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

import { MemberAvatar, MemberBadge } from './'
import { PhotoModal } from './PhotoModal'

export type MemberIconProps = AvatarProps & {
  color?: string
  member: Partial<Member>
  children?: ReactNode
}

export const MemberIcon = chakra(
  ({
    member,
    size = 'lg',
    color = 'white',
    children,
    ...props
  }: MemberIconProps) => {
    const [isOpen, setOpen] = useState<boolean>(undefined)
    let name = member?.nickname || member?.first_name
    return (
      <>
        {member && (
          <Flex gap={2} align="start" position="relative">
            <MemberAvatar
              member={member}
              size={size}
              color={color}
              bgGradient="linear(to-b, primary.500, primary.800)"
              cursor={member?.picture ? 'pointer' : ''}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (member?.picture) setOpen(true)
              }}
              {...props}
            ></MemberAvatar>

            <Flex
              direction="column"
              justify="center"
              gap={1}
              textAlign="left"
              align="start"
              overflow="hidden"
            >
              <Heading
                size={['md', 'lg']}
                textTransform="uppercase"
                noOfLines={1}
                m={0}
                color={color}
                title={member?.nickname || member.first_name}
                maxW={['15ch', '30ch', '30ch', '15ch']}
                whiteSpace="nowrap"
                textOverflow="ellipse"
              >
                {name}
              </Heading>
              <Flex
                gap={4}
                direction="row"
                alignItems="center"
                justifyItems="space-between"
                w="full"
              >
                <Box>
                  <MemberBadge member={member} my={2} />
                  {member.show_location && (
                    <Text fontSize="sm" color={color} mt={0}>
                      {member?.city} {member?.state}
                    </Text>
                  )}
                </Box>
                <Spacer flex={1} />
                {children}
              </Flex>
            </Flex>
            {member?.picture && (
              <PhotoModal
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

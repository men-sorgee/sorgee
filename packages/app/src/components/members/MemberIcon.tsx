import { Member } from "lib/models";
import { getAssetUrl } from "lib/utils";
import { memo, ReactNode, useState } from "react";

import {
  AvatarProps,
  Box,
  chakra,
  Flex,
  Heading,
  Spacer,
  Text
} from "@chakra-ui/react";

import { PhotoModal } from "../";
import { MemberAvatar, MemberBadge } from "./";

export type MemberIconProps = AvatarProps & {
  onChange?: () => void
  color?: string
  member: Partial<Member>
  children?: ReactNode
}

export const MemberIcon = memo(chakra(
  function MemberIcon({ member, size = 'lg', color = 'white', onChange, children, ...props }: MemberIconProps) {
    const [isOpen, setOpen] = useState<boolean>(undefined)
    let name = member?.nickname || member?.first_name
    return (
      <>
        {member && (
          <Flex px={2} gap={4} mb={2} align="start" position="relative">
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
            />

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
                gap={1}
                direction="row"
                alignItems="center"
                justifyItems="space-between"
                w="full"
              >

                <MemberBadge member={member} my={2}
                  onChange={() => {
                    if (onChange) onChange()
                  }} />
                {member.show_location && (
                  <Text fontSize="sm" color={color} mt={0}>
                    {member?.city} {member?.state}
                  </Text>
                )}


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
))

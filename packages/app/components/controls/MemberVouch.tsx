import { useCallback, useEffect, useState } from 'react'

import { useUser } from 'hooks'
import { Member, MemberLevel, SearchableMember, VouchingUser } from 'lib/models'
import { JsonFetcher, postJSON } from 'lib/utils'
import swr from 'swr'

import {
  Button,
  chakra,
  Heading,
  IconButton,
  IconButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'
import { HandRaisedIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

import { MemberAvatar } from './MemberAvatar'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member | SearchableMember>
}

export const MemberVouch = chakra(({ member, size = 'lg', ...props }: Props) => {
  const { user_type: level, nickname: name } = member
  const { loading: userLoading, member: me, level: myLevel, reload } = useUser()
  const [showVouchButton, setShowVouchButton] = useState(false)

  const {
    data: voucher,
    isLoading,
    mutate,
  } = swr<VouchingUser>(`/api/member/vouch/${member?.id}`, JsonFetcher, {})

  const vouchForPledge = useCallback(() => {
    // add buddy
    postJSON<any, VouchingUser>(`/api/member/vouch/${member?.id}`, {}).then((r) => {
      mutate(r.data, true)
      return reload()
    })
  }, [member?.id, mutate, reload])

  useEffect(() => {
    if (!userLoading && !isLoading && voucher?.id == undefined) {
      if (MemberLevel[level] == MemberLevel.pledge) {
        setShowVouchButton(true)
      }
    }
    if (voucher?.id) {
      setShowVouchButton(false)
    }
  }, [me, member?.id, userLoading, setShowVouchButton, isLoading, voucher, level, myLevel])

  return (
    <>
      {(voucher?.id && (
        <MemberAvatar
          size="sm"
          m={2}
          title={`Vouched by ${voucher.nickname} `}
          aria-label={`Vouched by ${voucher.nickname} `}
          member={voucher}
        />
      )) || <QuestionMarkCircleIcon width="30px" title={`Unendorsed `} aria-label={`Unendorsed`} />}
      {showVouchButton && (
        <Popover>
          <PopoverTrigger>
            <IconButton
              size={size}
              title="Vouch for Pledge"
              aria-label="Vouch for Pledge"
              icon={<HandRaisedIcon width="30px" />}
              variant="ghost"
              _hover={{ bg: 'primary.500' }}
              {...props}
            />
          </PopoverTrigger>
          <PopoverContent color="text">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              <Heading fontSize="xl" m={0}>
                Vouching for a Pledge
              </Heading>
            </PopoverHeader>
            <PopoverBody>
              <Text>
                When you vouch for someone, you put your reputation on the line. If this member is
                found to be disruptive, untrustworthy or otherwise not a good fit and needs to be
                banned, you may also get banned. Only vouch pledges you have met in person or have
                otherwise vetted and are certain they would make a great Brother.
              </Text>
              <Button
                my={2}
                w="full"
                size="lg"
                bg="primary"
                color="white"
                _hover={{ bg: 'accent.500' }}
                onClick={vouchForPledge}
              >
                Vouch for {name}
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
})

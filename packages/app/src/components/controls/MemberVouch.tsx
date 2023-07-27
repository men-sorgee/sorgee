import { useCallback, useEffect, useState } from 'react'

import { useUser } from 'hooks'
import { MemberLevel, Member, VouchingUser } from 'lib/models'
import { JsonFetcher, postJSON } from 'lib/utils'
import swr from 'swr'

import {
  AvatarBadge,
  Button,
  chakra,
  Heading,
  Icon,
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
  Tooltip,
  useToast
} from '@chakra-ui/react'
import { HandRaisedIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'

import { MemberAvatar } from './MemberAvatar'
import { CheckIcon } from '@chakra-ui/icons'
import { Loading } from './Loading'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member>
  hideVouch?: boolean
}

export const MemberVouch = chakra(
  ({
    member,
    hideVouch = false,
    size = ['sm', 'md', 'lg'],
    ...props
  }: Props) => {
    const toast = useToast()
    const [working, setWorking] = useState(false)
    const { user_type: level, nickname: name, vouched_by: voucher } = member
    const {
      loading: userLoading,
      member: me,
      level: myLevel,
      reload
    } = useUser()
    const [showVouchButton, setShowVouchButton] = useState(false)

    //const {
    //  data: voucher,
    //  isLoading,
    //  mutate
    //} = swr<VouchingUser>(`/api/member/vouch/${member?.id}`, JsonFetcher, {
    //  fallbackData: member?.vouched_by
    //})

    const vouchForPledge = useCallback(() => {
      // add buddy
      setWorking(true)
      postJSON<any, VouchingUser>(`/api/member/${member?.id}/vouch`, {}).then(
        (r) => {
          return reload().finally(() => {
            setWorking(false)
            setShowVouchButton(false)
            toast({
              title: 'Thanks!',
              description: `You have vouched for ${member?.nickname}. It may take a few moments for their new status to appear.`,
              status: 'success',
              duration: 5000,
              isClosable: true
            })
          })
        }
      )
    }, [member?.id, member?.nickname, reload, toast])

    useEffect(() => {
      if (!userLoading && voucher?.id == undefined) {
        if (MemberLevel[level] == MemberLevel.pledge) {
          setShowVouchButton(true)
        }
      }
      if (voucher?.id) {
        setShowVouchButton(false)
      }
    }, [
      me,
      member?.id,
      userLoading,
      setShowVouchButton,
      voucher,
      level,
      myLevel
    ])

    if (member?.id == me?.id) return null

    if (working) return <Loading />

    return (
      <>
        {voucher?.id && (
          <MemberAvatar
            id={`vouched-${member?.id}`}
            size="sm"
            borderColor="white"
            m={2}
            title={`Vouched for by ${voucher.nickname}`}
            member={voucher}
          >
            <AvatarBadge
              as={CheckIcon}
              bg="green"
              borderColor="white"
              boxSize={4}
            />
          </MemberAvatar>
        )}
        {showVouchButton && !hideVouch && (
          <Popover>
            <PopoverTrigger>
              <IconButton
                size={'sm'}
                title={`Vouch for ${name}`}
                aria-label={`Vouch for ${name}`}
                icon={<HandThumbUpIcon width="30px" />}
                _hover={{ color: 'primary.500' }}
                mx={2}
                {...props}
                color="primary.300"
                fill="white"
              />
            </PopoverTrigger>
            <PopoverContent color="text">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>
                <Heading fontSize="xl" m={0}>
                  Vouching for a {name}
                </Heading>
              </PopoverHeader>
              <PopoverBody>
                <Text>
                  When you vouch for someone, you put your reputation on the
                  line. If this member is found to be disruptive, untrustworthy
                  or otherwise not a good fit and needs to be banned, you may
                  also get banned. Only vouch pledges you have met in person or
                  have otherwise vetted and are certain they would make a great
                  Brother.
                </Text>
                <Button
                  my={2}
                  w="full"
                  size="lg"
                  bg="primary"
                  color="white"
                  _hover={{ bg: 'accent.500' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    vouchForPledge()
                  }}
                >
                  Vouch for {name}
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </>
    )
  }
)

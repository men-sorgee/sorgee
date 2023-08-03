import { useUser } from "hooks";
import { Member, MemberLevel, VouchingUser } from "lib/models";
import { JsonFetcher, postJSON } from "lib/utils";
import { useCallback, useEffect, useState } from "react";
import swr from "swr";

import { CheckIcon } from "@chakra-ui/icons";
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
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { HandRaisedIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";

import { Loading } from "./Loading";
import { MemberAvatar } from "./MemberAvatar";

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
    const { user_type: level, nickname: name, vouched_by } = member
    const {
      loading: userLoading,
      member: me,
      level: myLevel,
      reload
    } = useUser()
    const [showVouchButton, setShowVouchButton] = useState(false)

    const {
      data: voucher,
      isLoading,
      mutate
    } = swr<VouchingUser>(
      member?.id ? `/api/members/${member?.id}/vouch` : null,
      {
        fallbackData: vouched_by
      }
    )

    const vouchForPledge = useCallback(() => {
      // add buddy
      setWorking(true)
      postJSON<any, VouchingUser>(`/api/members/${member?.id}/vouch`, {}).then(
        ({ data: v, success }) => {
          if (success) {
            mutate(v).then(() => {
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
          } else {
            setWorking(false)
            toast({
              title: 'Error',
              description: `There was an error vouching for ${member?.nickname}. Please try again later.`,
              status: 'error',
              duration: 5000,
              isClosable: true
            })
          }
        }
      )
    }, [member?.id, member?.nickname, mutate, toast])

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
    const { onOpen, onClose, isOpen } = useDisclosure()

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
          <Popover isOpen={isOpen}>
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
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onOpen()
              }}
            />
            <PopoverContent color="text">
              <PopoverArrow />
              <PopoverCloseButton
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onClose()
                }}
              />
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

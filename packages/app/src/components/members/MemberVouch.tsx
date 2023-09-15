import {
  ButtonConfirm,
  Loading,
  MemberAvatar,
  MemberMessages
} from "components";
import { useMessageStats, useUser } from "hooks";
import { Member, MemberLevel, VouchingUser } from "lib/models";
import { ApiResult, postJSON, putJSON } from "lib/utils/apis";
import { useEffect, useRef, useState } from "react";
import swr from "swr";

import { CheckIcon } from "@chakra-ui/icons";
import {
  AvatarBadge,
  ButtonProps,
  chakra,
  FormLabel,
  Text,
  Textarea
} from "@chakra-ui/react";
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";

export type MemberVouchProps = Omit<ButtonProps, 'onError'> & {
  member: Partial<Member>
  hideVouch?: boolean
  onChange?: () => void
}

export const MemberVouch = chakra(({ member, size = ['sm', 'md', 'lg'], onChange, ...props }: MemberVouchProps) => {
  const { loading: statsLoading, stats } = useMessageStats(member?.id)
  const reasonRef = useRef<HTMLTextAreaElement>(null)
  const [working, setWorking] = useState(false)
  const { user_type: level, nickname: name, vouched_by } = member
  const { loading: userLoading, member: me, level: myLevel } = useUser()
  const [hasChatted, setHasChatted] = useState(false)
  const [showVouchButton, setShowVouchButton] = useState(false)
  const {
    data: voucher,
    isLoading,
    mutate,
  } = swr<VouchingUser>(member?.id ? `/api/members/${member?.id}/vouch` : null, {
    fallbackData: vouched_by,
  })


  useEffect(() => {
    if (!statsLoading && stats && me?.id) {
      setHasChatted(stats.conversations.find(c => c.id == me?.id) != undefined)
    }
    if (!isLoading && member?.id && !userLoading && me?.id) {
      setShowVouchButton(MemberLevel[level] == MemberLevel.pledge
        && myLevel >= MemberLevel.brother)
    }
  }, [me, member?.id, isLoading, setShowVouchButton, voucher?.id, level, myLevel, statsLoading, stats, userLoading])

  if (member?.id == me?.id) return null

  if (working || isLoading || statsLoading) return <Loading />

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
          <AvatarBadge as={CheckIcon} bg="green" borderColor="white" boxSize={4} />
        </MemberAvatar>
      )}
      {showVouchButton && (<>
        {hasChatted && (<>
          <ButtonConfirm<ApiResult<VouchingUser>>
            size={'sm'}
            title={`Vouch for ${name}`}
            aria-label={`Vouch for ${name}`}
            icon={<HandThumbUpIcon width="30px" />}
            _hover={{ color: 'primary.500' }}
            mx={2}
            variant='ghost'
            alertTitle="Vouch for this user?"
            buttonText={`Vouch for ${name}`}
            confirmedAction={() => {
              setWorking(true)
              return postJSON<any, VouchingUser>(`/api/members/${member?.id}/vouch`, {})
            }}
            onSuccess={({ data }) => {
              mutate(data)
              setWorking(false)
              setShowVouchButton(false)
              if (onChange) onChange()
            }}
            onError={(error) => {
              console.error(error)
              setWorking(false)
            }}
            failureMessage="There was an error vouching for this user. Please try again later."
            successMessage="You have vouched for this user."
            {...props}
          >

            <Text>
              When you vouch for someone, you put your reputation on the line. If this member is
              found to be disruptive, untrustworthy or otherwise not a good fit and needs to be
              banned, you may also get banned. Only vouch pledges you have met in person or have
              otherwise vetted and are certain they would make a great Brother.
            </Text>

          </ButtonConfirm>
          <ButtonConfirm<ApiResult<VouchingUser>>
            size={'sm'}
            title={`Deny ${name}`}
            aria-label={`Deny ${name}`}
            alertTitle="Deny this user?"
            buttonText="Deny"
            variant='ghost'
            confirmedAction={() => {
              setWorking(true)
              return putJSON<any, VouchingUser>(`/api/members/${member?.id}/vouch`, {
                reason: reasonRef.current?.value,
              })
            }}
            failureMessage="There was an error voting NO for this user. Please try again later."
            successMessage="You have voted NO for this user."
            onSuccess={({ data }) => {
              mutate(data)
              setWorking(false)
              setShowVouchButton(false)
              if (onChange) onChange()
            }}
            onError={(error) => {
              console.error(error)
              setWorking(false)
            }}

            icon={<HandThumbDownIcon width="30px" />}
            _hover={{ color: 'primary.500' }}
            mx={2}
            {...props}

          >
            <Text mb={2}>
              When you vote NO for someone, that user is not allowed to join the community.
              Please provide a reason for your decision.
            </Text>
            <FormLabel htmlFor="reason">Denial Reason: </FormLabel>
            <Textarea id="reason" required placeholder="Reason..." ref={reasonRef} />
          </ButtonConfirm>
        </>) || <MemberMessages member={member} size="sm" />}
      </>
      )}
    </>
  )
})


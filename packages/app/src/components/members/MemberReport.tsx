import { useUser } from "hooks";
import { Member, MemberLevel } from "lib/models";
import { postJSON } from "lib/utils";
import { useCallback, useRef, useState } from "react";

import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButtonProps,
  Spinner,
  Textarea
} from "@chakra-ui/react";
import { FlagIcon as ReportIcon } from "@heroicons/react/24/outline";
import { FlagIcon as ReportIconHover } from "@heroicons/react/24/solid";

import { ButtonConfirm } from "../";

export type MemberReportProps = Omit<IconButtonProps, 'aria-label' | 'onError'> & {
  member: Partial<Member>
}

export const MemberReport = chakra(
  ({ member, size = ['sm', 'md', 'lg'], ...props }: MemberReportProps) => {
    const { loading, member: me } = useUser()
    const [hover, setHover] = useState(false)
    const [message, setMessage] = useState<string>('')
    const formRef = useRef<HTMLFormElement>()

    const reportUser = useCallback(() => {
      if (MemberLevel[member?.user_type || 'applicant'] == MemberLevel.staff) return
      if (me?.id === member?.id) return
      // add buddy
      return postJSON(`/api/members/${member.id}/report`, {
        message,
      })
    }, [member?.id, me?.id, me?.user_type, member?.nickname, message])

    const label = `Report ${member?.nickname}`

    if (loading) return <Spinner size="sm" title={label} aria-label={label} />

    return (
      <>
        <ButtonConfirm
          size={size}
          alertTitle={label}
          title={label}
          _hover={{ bg: 'primary.500' }}
          variant="ghost"
          confirmedAction={() => {
            if (MemberLevel[member?.user_type || 'applicant'] == MemberLevel.staff) return
            if (me?.id === member?.id) return
            if (formRef.current.checkValidity()) {
              return reportUser().then(() => setMessage(''))
            }
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          successMessage="The user was reported"
          failureMessage="The user could not be reported"
          buttonText={'Report User'}
          icon={
            hover ? (
              <ReportIconHover width="30px" fill="red" />
            ) : (
              <ReportIcon width="30px" stroke="white" />
            )
          }
          disabled={me?.id === member?.id}
          {...props}
        >


          <FormControl id="message" isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              placeholder="What is the issue?"
              value={message}
              required
              onChange={(e) => setMessage(e.target.value)}
            />
            <FormErrorMessage>Please enter a message.</FormErrorMessage>
          </FormControl>

        </ButtonConfirm>
      </>
    )
  }
)

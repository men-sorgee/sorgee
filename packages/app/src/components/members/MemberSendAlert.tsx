import { Member, MemberAlert } from "lib/models";
import { postJSON } from "lib/utils/apis";
import { useRef } from "react";

import {
  ButtonProps,
  chakra,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea
} from "@chakra-ui/react";
import { MegaphoneIcon } from "@heroicons/react/24/outline";

import { ButtonConfirm } from "../controls";

export type MemberSendAlertProps = ButtonProps & {
  member: Partial<Member>
}

export const MemberSendAlert = chakra(({
  member,
  color = 'white',
  size
}: MemberSendAlertProps) => {
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const buttonUrlRef = useRef<HTMLInputElement>(null)
  const buttonTextRef = useRef<HTMLInputElement>(null)
  const iconRef = useRef<HTMLSelectElement>(null)



  return (
    <ButtonConfirm
      size={size}
      variant="ghost"
      _hover={{ bg: 'primary.500' }}
      color={color}
      icon={<MegaphoneIcon width="30px" stroke="white" />}
      alertTitle="Send Alert"
      buttonText="Send Alert"
      successMessage="Alert sent successfully!"
      failureMessage="Failed to send alert."
      confirmedAction={() => {
        return postJSON<Partial<MemberAlert>>(`/api/members/${member?.id}/alerts`, {
          message: messageRef.current?.value,
          button_url: buttonUrlRef.current?.value,
          button_text: buttonTextRef.current?.value,
          icon: iconRef.current?.value as any
        })
      }}
      onSuccess={({ data }) => {
      }}
      onError={(err) => {
      }}>

      <Text mb={2} mt={0}>Send Alert to {member?.nickname}</Text>
      <FormControl>
        <FormLabel color="text">Button Type:</FormLabel>
        <Select required ref={iconRef} name="icon">
          <option value="info">Information</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="success">Success</option>
          <option value="loading">Waiting</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel color="text">Message:</FormLabel>
        <Textarea required ref={messageRef} name="message" />
      </FormControl>
      <FormControl>
        <FormLabel color="text">Button Text:</FormLabel>
        <Input ref={buttonTextRef} name="button_text" type="text" placeholder="Button Text" />
      </FormControl>

      <FormControl>
        <FormLabel color="text">Button URL:</FormLabel>
        <Input ref={buttonUrlRef} name="button_url" type="text" placeholder="Button URL" />
      </FormControl>

    </ButtonConfirm>

  )
})

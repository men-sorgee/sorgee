import { formatDistanceToNowStrict } from "date-fns";
import { Member } from "lib/models";

import {
  ButtonGroup,
  chakra,
  Flex,
  ResponsiveValue,
  Spacer,
  Text
} from "@chakra-ui/react";

import {
  MemberBlock,
  MemberBuddy,
  MemberLike,
  MemberMessages,
  MemberReport,
  MemberSendAlert,
  MemberShare
} from "./";
import { MemberDistance } from "./MemberDistance";

export type MemberActionsProps = {
  member: Partial<Member>,
  viewer: Partial<Member>,
  size?: ResponsiveValue<(string & {}) | 'sm' | 'md' | 'lg'>
}

export const MemberActions = chakra(({ viewer, member, size = ['sm', 'md', 'lg'] }: MemberActionsProps) => {

  const color = "white"
  if (!member || !viewer) return null
  return (
    <>
      <Flex w="full" justify="space-between">
        <ButtonGroup size={size}>
          <MemberBlock member={member} size={size} />
          <MemberReport member={member} size={size} />
        </ButtonGroup>
        <Spacer />
        <ButtonGroup size={size}>
          {viewer?.user_type == 'staff' && (
            <MemberSendAlert member={member} size={size} />
          )}
          <MemberLike member={member} size={size} />
          <MemberMessages member={member} size={size} />
          <MemberBuddy member={member} size={size} />
          <MemberShare member={member} size={size} />
        </ButtonGroup>
      </Flex>
      <Flex w="full" align='bottom' justify='space-between'>
        <Text fontSize="xs" color={color}>
          {member?.show_profile && member.last_login && (
            <>Last Login: {formatDistanceToNowStrict(new Date(member.last_login))} ago</>
          )}
        </Text>
        <Text fontSize="xs" textAlign='center' color={color}>
          <MemberDistance member={member} />
        </Text>
        <Text fontSize="xs" textAlign='right' color={color}>
          Member Since: {new Date(member.approved_date || member.date_created).toLocaleDateString()}
        </Text>
      </Flex>
    </>
  )
})

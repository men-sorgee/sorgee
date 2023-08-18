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
  MemberShare
} from "./";
import { MemberDistance } from "./MemberDistance";

export type MemberActionsProps = {
  member: Partial<Member>
  size?: ResponsiveValue<(string & {}) | 'sm' | 'md' | 'lg'>
}

export const MemberActions = chakra(({ member, size = ['sm', 'md', 'lg'] }: MemberActionsProps) => {
  if (!member) return null
  return (
    <>
      <Flex w="full" justify="space-between">
        <ButtonGroup size={size}>
          <MemberBlock member={member} size={size} />
          <MemberReport member={member} size={size} />
        </ButtonGroup>
        <Spacer />
        <ButtonGroup size={size}>
          <MemberLike member={member} size={size} />
          <MemberMessages member={member} size={size} />
          <MemberBuddy member={member} size={size} />
          <MemberShare member={member} size={size} />
        </ButtonGroup>
      </Flex>
      <Flex w="full" align='bottom' justify='space-between'>
        <Text fontSize="xs">
          {member?.show_profile && member.last_login && (
            <>Last Login: {formatDistanceToNowStrict(new Date(member.last_login))} ago</>
          )}
        </Text>
        <Text fontSize="xs" textAlign='center'>
          <MemberDistance member={member} />
        </Text>
        <Text fontSize="xs" textAlign='right'>
          Member Since: {new Date(member.approved_date || member.date_created).toLocaleDateString()}
        </Text>
      </Flex>
    </>
  )
})

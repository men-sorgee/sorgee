import { formatDistanceToNowStrict } from 'date-fns'
import { Member } from 'lib/models'
import {
  ButtonGroup,
  chakra,
  Flex,
  Spacer,
  Text,
  ResponsiveValue
} from '@chakra-ui/react'
import {
  MemberMessages,
  MemberBuddy,
  MemberLike,
  MemberBlock,
  MemberShare,
  MemberReport
} from '.'

type Props = {
  member: Partial<Member>
  size?: ResponsiveValue<(string & {}) | 'sm' | 'md' | 'lg'>
}

export const MemberActions = chakra(
  ({ member, size = ['sm', 'md', 'lg'] }: Props) => {
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
        <Flex w="full">
          <Text fontSize="xs">
            {member?.show_profile && member.last_login && (
              <>
                Last Login:{' '}
                {formatDistanceToNowStrict(new Date(member.last_login))} ago
              </>
            )}
          </Text>
          <Spacer />
          <Text fontSize="xs">
            Member Since:{' '}
            {new Date(
              member.approved_date || member.date_created
            ).toLocaleDateString()}
          </Text>
        </Flex>
      </>
    )
  }
)

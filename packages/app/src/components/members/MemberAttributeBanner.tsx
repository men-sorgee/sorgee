import { capitalCase } from "change-case";
import { Member } from "lib/models";

import {
  Badge,
  chakra,
  Flex,
  FlexProps,
  ResponsiveValue
} from "@chakra-ui/react";

export type MemberAttributeBannerProps = FlexProps & {
  member: Partial<Member>
  fontSize?: ResponsiveValue<string | number>
}

export const MemberAttributeBanner = chakra(
  ({ member, fontSize = ['xx-small', 'xs', 'sm'], ...props }: MemberAttributeBannerProps) => {
    const badgeProps = {
      px: 2,
      py: 0.5,
      fontSize,
      color: 'white',
      rounded: 'full',
      border: '1px solid',
      borderColor: 'primary.900',
      shadow: 'md',
    }

    return (
      <>
        {member?.show_profile && (
          <Flex direction="row" justify="center" align="center" gap={1} p={0.5} w="full" {...props}>
            {member?.mannerisms && (
              <Badge bg="primary.800" {...badgeProps}>
                {capitalCase(member.mannerisms)}
              </Badge>
            )}
            {member?.relationship_status && (
              <Badge {...badgeProps} bg="primary.700">
                {capitalCase(member.relationship_status)}
              </Badge>
            )}
            {member?.spectrum && (
              <Badge {...badgeProps} bg="primary.600">
                {capitalCase(member.spectrum)}
              </Badge>
            )}
          </Flex>
        )}
      </>
    )
  }
)

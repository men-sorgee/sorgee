import { MemberProgressCheck } from "components";
import { Member } from "lib/models";

import { Heading, List, ListItem, VStack } from "@chakra-ui/react";

export type MemberProgressProps = {
  member: Member
}

export const MemberProgress = ({ member }: MemberProgressProps) => {
  return (
    <>
      <VStack>
        <Heading mt={0} as="h2" mb={4} fontSize="xl" color="white">
          Provide as much information as you can about yourself.
        </Heading>
        <List alignItems="start" justifyItems="start" w="full" spacing={2}>
          <ListItem>
            <MemberProgressCheck
              member={member}
              step="avatar"
              size={6}
              href="/member/photos"
              label="Public Avatar"
            />
          </ListItem>
          <ListItem>
            <MemberProgressCheck
              member={member}
              step="contact"
              size={6}
              href="/member/settings/contact"
              label="Contact Information"
            />
          </ListItem>
          <ListItem>
            <MemberProgressCheck
              member={member}
              step="events"
              size={6}
              href="/member/settings/events"
              label="Event Settings"
            />
          </ListItem>
          <ListItem>
            <MemberProgressCheck
              member={member}
              step="interests"
              size={6}
              href="/member/settings/interests"
              label="Your Interests"
            />
          </ListItem>
          <ListItem>
            <MemberProgressCheck
              member={member}
              step="profile"
              size={6}
              href="/member/profile/basic"
              label="Basic Profile"
            />
          </ListItem>
          <ListItem>
            <MemberProgressCheck
              member={member}
              step="explicit"
              size={6}
              href="/member/profile/explicit"
              label="Sexual Details"
            />
          </ListItem>
          <ListItem>
            <MemberProgressCheck
              member={member}
              step="roles"
              size={6}
              href="/member/profile/roles"
              label="Sexual Roles"
            />
          </ListItem>
          <ListItem>
            <MemberProgressCheck
              member={member}
              step="health"
              size={6}
              href="/member/profile/health"
              label="Sexual Health Information"
            />
          </ListItem>
          <ListItem>
            <MemberProgressCheck
              member={member}
              step="photos"
              size={6}
              href="/member/photos"
              label="Upload Photos"
            />
          </ListItem>
        </List>
      </VStack>
    </>
  )
}

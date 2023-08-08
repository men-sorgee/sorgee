import { useMemberSearch } from "hooks";
import { Member, MemberLevel, SearchableMember } from "lib/models";
import { ReactNode, useEffect, useState } from "react";

import { Box, BoxProps, chakra, SimpleGrid, Text } from "@chakra-ui/react";

import { ButtonLink, MemberCard } from "./";

export type MembersNewProps = BoxProps & {
  member: Member
  children?: ReactNode
}

export const MembersNewBox = chakra(({ member, children, ...props }: MembersNewProps) => {
  const [newestPledges, setNewestPledges] = useState<SearchableMember[]>([])
  const [oldestPledges, setOldestPledges] = useState<SearchableMember[]>([])

  const { members: pledges, meta: pledgeMeta } = useMemberSearch(1, 50, '-approved_date', {
    user_type: MemberLevel[MemberLevel.pledge],
  })
  useEffect(() => {
    if (pledges && pledges.length > 0 && newestPledges.length == 0 && oldestPledges.length == 0) {
      setNewestPledges(pledges.slice(0, 4))
      setOldestPledges(pledges.slice(-4))
    }
  }, [newestPledges.length, oldestPledges.length, pledges])

  return (
    <>
      <Box {...props}>
        {children}
        {pledges && (
          <SimpleGrid columns={[1, 1, 2]} spacing={4}>
            {newestPledges?.map((p) => (
              <MemberCard key={p.id} member={p} viewer={member} full={false} />
            ))}
          </SimpleGrid>
        )}

        <Text textAlign="center" my={2}>
          The oldest {oldestPledges.length} of {pledgeMeta.filtered} Pledges still waiting...
        </Text>

        <SimpleGrid columns={[1, 1, 2]} spacing={4}>
          {oldestPledges?.map((p) => (
            <MemberCard key={p.id} member={p} viewer={member} full={false} />
          ))}
        </SimpleGrid>
        <ButtonLink
          href="/members/pledges"
          colorScheme="accent"
          mx="auto"
          mt={4}
          size="lg"
          fontSize={['md', 'lg', 'xl']}
        >
          View All Pledges
        </ButtonLink>
      </Box>
    </>
  )
})

import { useMemberSearch } from "hooks";
import { Member, MemberLevel, SearchableMember } from "lib/models";
import { ReactNode, useEffect, useState } from "react";

import { Box, BoxProps, chakra, SimpleGrid, Text } from "@chakra-ui/react";

import { ButtonLink, MemberCard } from "../";

export type MembersNewProps = BoxProps & {
  member: Member
  children?: ReactNode
}

export const MembersNewBox = chakra(({ member, children, ...props }: MembersNewProps) => {
  const [newestPledges, setNewestPledges] = useState<SearchableMember[]>(undefined)
  const [oldestPledges, setOldestPledges] = useState<SearchableMember[]>(undefined)
  const { members: pledges, count } = useMemberSearch({
    sort: '-approved_date',
    user_type: MemberLevel[MemberLevel.pledge],
  })

  useEffect(() => {
    if (pledges && pledges.length > 0 && newestPledges == undefined && oldestPledges == undefined) {
      setNewestPledges(pledges.slice(0, 4))
      setOldestPledges(pledges.slice(-4))
    }
  }, [newestPledges, oldestPledges, pledges])

  return (
    <>
      <Box {...props}>
        {children}
        {newestPledges && (
          <SimpleGrid columns={[1, 1, 2]} spacing={4}>
            {newestPledges?.map((p) => (
              <MemberCard
                key={p.id}
                member={p}
                viewer={member}
                full={false}
                href={`/pledges?id=${p.id}`}
              />
            ))}
          </SimpleGrid>
        )}

        <Text textAlign="center" my={2}>
          The oldest {oldestPledges?.length} of {count} Pledges still waiting...
        </Text>

        {oldestPledges && (
          <SimpleGrid columns={[1, 1, 2]} spacing={4}>
            {oldestPledges?.map((p) => (
              <MemberCard
                key={p.id}
                member={p}
                viewer={member}
                full={false}
                href={`/pledges?id=${p.id}`}
              />
            ))}
          </SimpleGrid>
        )}
        <ButtonLink
          href="/pledges"
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

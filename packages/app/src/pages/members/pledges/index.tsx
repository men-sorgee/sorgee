import { createRef, useCallback, useEffect, useState } from 'react'

import { Lazy, MemberCard, MemberModal, Pager } from 'components/controls'
import Page from 'components/Page'

import { useUser } from 'hooks'
import { MemberLevel, SearchableMember } from 'lib/models'

import { Container, SimpleGrid, Text } from '@chakra-ui/react'

import { useMemberSearch } from 'hooks'

export const getServerSideProps = async (context) => {
  return {
    props: {}
  }
}

export default function PledgeListPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('-last_login')

  const { member: currentMember, loading } = useUser({
    minLevel: MemberLevel.brother,
    requiredFeature: 'view_directory',
    redirectsEnabled: true
  })

  const { members, meta } = useMemberSearch(page, size, sort, {
    user_type: MemberLevel[MemberLevel.pledge]
  })

  return (
    <Page title="Pledges" requireAuth={true} loading={loading}>
      <SimpleGrid
        my={4}
        columns={[1, 1, 1, 2]}
        spacing={4}
        w="full"
        justifyItems="stretch"
      >
        {members?.map((member: SearchableMember) => (
          <Lazy key={member.id}>
            <MemberCard
              full
              size="xl"
              key={member.id}
              viewer={currentMember}
              member={member}
            />
          </Lazy>
        ))}
      </SimpleGrid>
      {meta.filtered == 0 && (
        <Container w="4xl" textAlign="center">
          <Text>No results found</Text>
        </Container>
      )}
    </Page>
  )
}

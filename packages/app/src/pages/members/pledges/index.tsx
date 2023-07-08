import { createRef, useCallback, useEffect, useState } from 'react'

import { Lazy, MemberCard, MemberModal, Pager } from 'components/controls'
import Page from 'components/Page'

import { useUser } from 'hooks'
import { MemberLevel, SearchableMember } from 'lib/models'

import { Container, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react'

import { useMemberSearch } from 'hooks'

export const getServerSideProps = async (context) => {
  return {
    props: {}
  }
}

export default function PledgeListPage() {
  const [id, setId] = useState<string>()
  const { member: currentMember, loading } = useUser({
    minLevel: MemberLevel.brother,
    requiredFeature: 'view_directory',
    redirectsEnabled: true
  })

  const { members, meta } = useMemberSearch(1, 20, 'last_login', {
    user_type: MemberLevel[MemberLevel.pledge]
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    if (id) {
      onOpen()
    } else {
      onClose()
    }
  }, [id, setId, onOpen, onClose])

  const close = useCallback(() => {
    onClose()
    setId(undefined)
  }, [onClose])

  return (
    <Page title="Pledges" requireAuth={true} loading={loading}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Pledges are men who have accepted a bid to join the fraternity, but have
        not yet been vouched for by a brother. If you want to reach out to a
        Pledge, please do. If you want to vouch for a Pledge, use the vouch
        button on their profile.
      </Text>
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
              onClick={() => setId(member.id)}
            />
          </Lazy>
        ))}
      </SimpleGrid>
      <MemberModal isOpen={isOpen} memberId={id as string} onClose={close} />
      {meta.filtered == 0 && (
        <Container w="4xl" textAlign="center">
          <Text>No results found</Text>
        </Container>
      )}
    </Page>
  )
}

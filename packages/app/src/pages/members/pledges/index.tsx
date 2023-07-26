import { useCallback, useEffect, useState } from 'react'

import {
  Lazy,
  MemberCard,
  MemberModal,
  Pager,
  UserSurveyAnswers
} from 'components/controls'
import Page from 'components/Page'

import { useUser } from 'hooks'
import { MemberLevel, SearchableMember } from 'lib/models'

import {
  Badge,
  Container,
  SimpleGrid,
  Text,
  useDisclosure
} from '@chakra-ui/react'

import { useMemberSearch } from 'hooks'
import { pledgeSurvey } from '../../../lib/config'

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

  const { members, meta } = useMemberSearch(1, 20, 'approved_date', {
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
        These men have pledged a bid to join the brotherhood, but no one has
        vouched for them yet. To vouch for a Pledge, use the vouch button on
        their profile.
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
            ></MemberCard>
          </Lazy>
        ))}
      </SimpleGrid>
      <MemberModal isOpen={isOpen} memberId={id as string} onClose={close}>
        <UserSurveyAnswers userId={id as string} surveyId={pledgeSurvey} />
      </MemberModal>
      {meta.filtered == 0 && (
        <Container w="4xl" textAlign="center">
          <Text>No results found</Text>
        </Container>
      )}
    </Page>
  )
}

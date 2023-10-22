import {
  Lazy,
  MemberCard,
  MemberModal,
  MemberSurveyAnswers,
  Page
} from "components";
import { useMemberSearch, useUser } from "hooks";
import { pledgeSurvey } from "lib/config";
import { MemberLevel, SearchableMember } from "lib/models";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Container, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react";

export default function PledgeListPage() {
  const [pledge, setPledge] = useState<SearchableMember>()
  const { member: currentMember, loading } = useUser({
    minLevel: MemberLevel.brother,
    redirectsEnabled: true,
  })

  const {
    members,
    count,
    loading: pledgesLoading,
    reload
  } = useMemberSearch({
    size: -1,
    sort: 'approved_date',
    user_type: MemberLevel[MemberLevel.pledge],
  })

  const params = useSearchParams()
  useEffect(() => {
    if (!pledgesLoading && members && params.get('id')) {
      let pledge = members.find((m) => m.id == params.get('id'))
      setPledge(pledge)
    }
  }, [pledgesLoading, members, params, setPledge])

  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    if (pledge) {
      onOpen()
    } else {
      onClose()
    }
  }, [pledge, setPledge, onOpen, onClose])

  const close = useCallback(() => {
    onClose()
    setPledge(undefined)
  }, [onClose])

  return (
    <Page title="Pledges" loading={loading || pledgesLoading}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        These {count} men have pledged a bid to join the brotherhood and are waiting
        for you to reach out to them. They need a brother to vouch for them to get in.
        To vouch for a Pledge, you must initiate a conversation first. Once you have
        reached out, click the Thumbs-Up to vouch for them or the Thumbs-down to have
        them rejected.
      </Text>
      <SimpleGrid my={4} columns={[1, 1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
        {members?.map((m: SearchableMember) => (
          <Lazy key={m.id}>
            <MemberCard
              full
              size="xl"
              key={m.id}
              viewer={currentMember}
              member={m}
              onClick={() => setPledge(m)}
              onChange={() => {
                reload()
                setPledge(undefined)
              }}
            ></MemberCard>
          </Lazy>
        ))}
      </SimpleGrid>
      <MemberModal
        isOpen={isOpen}
        memberId={pledge?.id}
        onClose={close}
        size="xl"
        accordionItems={[
          {
            title: 'Pledge Survey Answers',
            content: (
              <MemberSurveyAnswers member={pledge} surveyId={pledgeSurvey} headingSize="sm" />
            ),
          },
        ]}
      ></MemberModal>
      {count == 0 && (
        <Container w="4xl" textAlign="center">
          <Text>No results found</Text>
        </Container>
      )}
    </Page>
  )
}

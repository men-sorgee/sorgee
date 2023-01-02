import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import ApplicationSteps from './_steps'
import { Text, Heading, HStack, VStack } from '@chakra-ui/react'
import Page from 'components/Page'
import { LinkButton } from '../../components/ui'

function Approved() {
  const router = useRouter()
  const { loading, member } = useMember()

  if (member && member?.application_status && member.application_status !== 'approved') {
    router.push('/apply/' + member?.application_status)
    return null
  }

  return (
    <Page
      title="Application Approved"
      loading={loading}
      requireAuth={true}
      header={<ApplicationSteps status={'approved'} />}
    >
      <>
        <Heading as="h2">
          Congratulations! <br />
          Your membership was approved.
        </Heading>

        <VStack alignItems="start" justifyItems="middle">
          <Text>
            You will now get periodic event invites as well as access to our member-only content.
          </Text>
          <HStack spacing={4} textAlign="center">
            <LinkButton href="/member/invite" colorScheme="primary">
              Invite a Friend
            </LinkButton>
            <LinkButton href="/member/account" colorScheme="primary">
              Manage Full Profile
            </LinkButton>
          </HStack>
        </VStack>
      </>
    </Page>
  )
}

export default Approved

import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import ApplicationSteps from './_steps'
import { Text, Heading, HStack, VStack } from '@chakra-ui/react'
import Page from 'components/Page'
import { LinkButton } from '../../components/controls'

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
        <Heading as="h2" pt={10}>
          Congratulations and Welcome!
        </Heading>
        <Heading as="h3">Your membership was approved.</Heading>

        <VStack alignItems="center" justifyItems="middle" pt={10}>
          <Text>
            You will now get periodic event invites as well as access to our member-only content.
          </Text>
          <LinkButton colorScheme="primary" href="/members">
            View Members
          </LinkButton>
          <Text>Or, manage your account:</Text>
          <HStack spacing={4} textAlign="center" mt={4}>
            <LinkButton href="/member/settings" colorScheme="primary">
              Manage Account
            </LinkButton>
            <LinkButton href="/member/profile" colorScheme="primary">
              Manage Profile
            </LinkButton>
          </HStack>
        </VStack>
      </>
    </Page>
  )
}

export default Approved

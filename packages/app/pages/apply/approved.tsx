import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/router'
import ApplicationSteps from './_steps'
import { Text, Heading, HStack, VStack } from '@chakra-ui/react'
import Page from 'components/Page'
import { ButtonLink } from '../../components/controls'

function Approved() {
  const router = useRouter()
  const { loading, member } = useUser()

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
        <Heading as="h2" size="h2" pt={10} textAlign="center">
          Congratulations and Welcome!
        </Heading>
        <Heading as="h3" size="h3" textAlign="center">
          Your membership was approved.
        </Heading>

        <VStack alignItems="center" justifyItems="middle" pt={10}>
          <Text textAlign="center">
            You will now get periodic event invites as well as access to our member-only content.
          </Text>
          <Text>Complete your account:</Text>
          <HStack spacing={4} textAlign="center" mt={4}>
            <ButtonLink href="/member/settings" colorScheme="primary">
              Manage Account
            </ButtonLink>
            <ButtonLink href="/member/profile" colorScheme="primary">
              Manage Profile
            </ButtonLink>
          </HStack>
        </VStack>
      </>
    </Page>
  )
}

export default Approved

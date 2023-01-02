import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import ApplicationSteps from './_steps'
import Page from 'components/Page'
import { Text, Heading } from '@chakra-ui/react'

function Review() {
  const router = useRouter()
  const { loading, member } = useMember()

  if (member && member?.application_status && member.application_status !== 'review') {
    router.push('/apply/' + member?.application_status)
    return null
  }

  return (
    <Page
      title="Verification Review"
      loading={loading}
      requireAuth={true}
      header={<ApplicationSteps status={'review'} />}
    >
      <>
        <Heading as="h2" size="xl">
          Good things cum to those that wait!
        </Heading>
        <Text fontSize="2xl">
          Thank you for submitting your application and verification photo.
        </Text>
        <Text fontSize="2xl">
          Your application is currently being reviewed by our team. You will receive an email with
          our decision within 7 days.
        </Text>
      </>
    </Page>
  )
}

export default Review

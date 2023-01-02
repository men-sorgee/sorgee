import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import ApplicationSteps from './_steps'
import Page from 'components/Page'

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
        <h2 className="text-center">Good things cum to those that wait!</h2>
        <p className="text-center text-xl">
          Thank you for submitting your application and verification photo.
        </p>
        <p className="text-center">
          Your application is currently being reviewed by our team. You will receive an email with
          our decision within 7 days.
        </p>
      </>
    </Page>
  )
}

export default Review

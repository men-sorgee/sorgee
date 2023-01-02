import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ApplicationSteps from './_steps'
import { SparklesIcon } from '@heroicons/react/solid'
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
      sectionClass="gradient p-4 text-center"
      header={<ApplicationSteps status={'approved'} />}
    >
      <>
        <h2>Congratulations! Your membership was approved.</h2>
        <SparklesIcon className="mx-auto my-4 h-[50px] animate-bounce text-white" />
        <p className="text-center">
          You will now get periodic event invites as well as access to our member-only content.
        </p>
        <div className="mt-2 flex flex-row items-center justify-center space-x-4 pt-4">
          <LinkButton href="/member/invite" className="btn-primary">
            Invite a Friend
          </LinkButton>
          <LinkButton href="/member/account" className="btn-primary">
            Manage Full Profile
          </LinkButton>
        </div>
      </>
    </Page>
  )
}

export default Approved

import Page from "components/Page";
import { useUser } from "hooks";
import { ApplicationStatus, MemberLevel } from "lib/models";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Index({}) {
  const { member, loading } = useUser({
    minLevel: MemberLevel.applicant,
    minAppStatus: ApplicationStatus.apply,
    redirectsEnabled: true
  })
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (member) {
      const { application_status } = member
      if (application_status === 'approved') {
        router.push('/member')
      } else {
        router.push('/apply/' + application_status)
      }
    } else {
      signIn(null, {
        callbackUrl: '/apply'
      })
    }
  }, [loading, router, member])

  return (
    <Page title="Application" loading={true}>
      <></>
    </Page>
  )
}

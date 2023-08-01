import { useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { Loading } from 'components/controls'
import Page from 'components/Page'
import { useRouter } from 'next/router'
import { useUser } from 'hooks'

export default function Index({}) {
  const { member, loading } = useUser({})
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (member) {
      const { application_status } = member
      if (application_status === 'approved') {
        router.push('/member').catch(console.error)
      } else {
        router.push('/apply/' + application_status).catch(console.error)
      }
    } else {
      signIn('email', {
        callbackUrl: '/apply'
      }).catch(console.error)
    }
  }, [loading, router, member])

  return (
    <Page title="Application" loading={true}>
      <Loading />
    </Page>
  )
}

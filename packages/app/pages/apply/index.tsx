import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Page from 'components/Page'
import { Loading } from 'components/controls'
export default function Index({}) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      signIn()
    },
  })
  const { user } = session || {}
  const router = useRouter()

  useEffect(() => {
    if (status !== 'loading' && user) {
      const { application_status } = user || {}
      if (application_status === 'approved') {
        router.push('/members')
      } else {
        router.push('/apply/' + application_status)
      }
    }
  }, [status, router, user])

  return (
    <Page title="Application" requireAuth={true}>
      <Loading>Sit tight</Loading>
    </Page>
  )
}

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Page from 'components/Page'
import { Heading } from '@chakra-ui/react'
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
        // TODO: move this the main members page once it's in place
        router.push('/apply/approved')
      } else {
        router.push('/apply/' + application_status)
      }
    }
  }, [status, router, user])

  return (
    <Page loading={status === 'loading'} title="Application" requireAuth={true}>
      <Heading>Redirecting...</Heading>
    </Page>
  )
}

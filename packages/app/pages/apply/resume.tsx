import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ApplicationStatus } from 'lib/models'
import { useEffect, useState } from 'react'
import Page from 'components/Page'
import { LinkButton } from 'components/ui'

function getMemberPage(status?: string) {
  if (!status) return '/apply'
  const type = ApplicationStatus[status]
  switch (type) {
    case ApplicationStatus.apply:
      return '/apply'
    default:
      return `/apply/${status}`
  }
}

export default function Resume({}) {
  const { data: session, status } = useSession()
  const [page, setPage] = useState('/apply')
  const { user } = session || {}
  const router = useRouter()
  const { application_status } = user || {}

  useEffect(() => {
    if (status == 'unauthenticated') {
      signIn()
    }
    if (application_status) {
      setPage(getMemberPage(application_status))
      router.push(page)
    }
  }, [application_status, status, page, router])

  return (
    <Page loading={status !== 'authenticated'} title="Application" requireAuth={true}>
      <LinkButton href={page} color="primary">
        Resume Application
      </LinkButton>
    </Page>
  )
}

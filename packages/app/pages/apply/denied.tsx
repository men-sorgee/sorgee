import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import Page from 'components/Page'
import { Text, Heading, Link } from '@chakra-ui/react'

function Denied() {
  const router = useRouter()
  const { loading, member } = useMember()

  if (member && member?.application_status && member.application_status !== 'denied') {
    router.push('/apply/' + member?.application_status)
    return null
  }

  return (
    <Page
      title="Application Denied"
      loading={loading}
      requireAuth={true}
      sectionClass="gradient p-4 text-center"
    >
      <>
        <Heading as="h2" size="xl">
          Unfortunately, your application was denied.
        </Heading>
        <Text fontSize="2xl">{member?.photo_denial_reason}</Text>
        <Text fontSize="2xl">
          If this was a mistake or you'd like to appeal, please contact us at{' '}
          <Link className="link" href="mailto:support@guysnheat.com">
            support
          </Link>
          .
        </Text>
      </>
    </Page>
  )
}

export default Denied

import Page from 'components/Page'
import { useRouter } from 'next/router'

import { useUser } from 'hooks/use-user'
import { Heading, Link, Text } from '@chakra-ui/react'

import { MemberLevel } from 'lib/models'

function Denied() {
  const router = useRouter()
  const { loading, member } = useUser({
    minLevel: MemberLevel.applicant
  })

  return (
    <Page title="Application Denied" loading={loading}>
      <>
        <Heading as="h2" size="xl" pt={10}>
          Unfortunately, your application was denied.
        </Heading>
        <Text pt={10} fontSize="2xl">
          {member?.photo_denial_reason}
        </Text>
        <Text fontSize="2xl">
          The more the merrier with us, but some aspect of your application did
          not add up. Mistakes happen, and if you believe a mistake was made and
          you want to try again, please contact
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

import { MemberProgress, Page } from 'components'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { Text, Heading, Box, Alert, AlertIcon } from '@chakra-ui/react'
import { useUser } from 'hooks'
import { MemberLevel } from 'lib/models'

export default function MemberHomePage() {
  const { member, level, loading } = useUser()
  return (
    <Page title="Member Home" hideHeader loading={loading}>
      {level == MemberLevel.pledge && (
        <>
          <Heading as="h1" size="2xl" textAlign="center">
            Welcome Pledge!
          </Heading>
          <Box maxWidth="xl" mx="auto">
            <Text fontSize="xl">
              You joined the site without an existing Brother to vouch for you.
              That is 100% okay! We encourage Brothers to browse Pledge profiles
              and reach out to those they want to contact and potentially vouch
              for.
            </Text>

            <Text fontSize="xl"></Text>
          </Box>
        </>
      )}
      <Box maxWidth="xl" mx="auto">
        <Alert my={4} rounded="lg" shadow="lg" alignItems="start">
          <AlertIcon boxSize={[30, 35, 40]} as={ClipboardDocumentListIcon} />
          <MemberProgress member={member} />
        </Alert>
      </Box>
    </Page>
  )
}

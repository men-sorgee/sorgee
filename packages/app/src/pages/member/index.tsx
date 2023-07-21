import { MemberProgressCheck, Page } from 'components'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import {
  Text,
  Heading,
  Flex,
  Box,
  Center,
  Alert,
  AlertIcon,
  List,
  ListItem,
  VStack
} from '@chakra-ui/react'
import { useUser } from 'hooks'
import { MemberLevel } from 'lib/models'

// 'avatar' | 'contact' | 'events' | 'interests' | 'profile' | 'explicit' | 'roles' | 'health'
export default function MemberHomePage() {
  const { member, level } = useUser()
  return (
    <Page title="Member Home" hideHeader>
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
          <VStack>
            <Heading mt={0} as="h2" mb={4} fontSize="xl">
              Provide as much information as you can about yourself!
            </Heading>
            <List alignItems="start" justifyItems="start" w="full">
              <ListItem>
                <MemberProgressCheck
                  member={member}
                  step="avatar"
                  size={6}
                  href="/member/photos"
                  label="Upload your Avatar"
                />
              </ListItem>
              <ListItem>
                <MemberProgressCheck
                  member={member}
                  step="contact"
                  size={6}
                  href="/member/settings/contact"
                  label="Update your Contact Information"
                />
              </ListItem>
              <ListItem>
                <MemberProgressCheck
                  member={member}
                  step="avatar"
                  size={6}
                  href="/member/photos"
                  label="Upload your Avatar"
                />
              </ListItem>
              <ListItem>
                <MemberProgressCheck
                  member={member}
                  step="avatar"
                  size={6}
                  href="/member/photos"
                  label="Upload your Avatar"
                />
              </ListItem>
              <ListItem>
                <MemberProgressCheck
                  member={member}
                  step="avatar"
                  size={6}
                  href="/member/photos"
                  label="Upload your Avatar"
                />
              </ListItem>
              <ListItem>
                <MemberProgressCheck
                  member={member}
                  step="avatar"
                  size={6}
                  href="/member/photos"
                  label="Upload your Avatar"
                />
              </ListItem>
              <ListItem>
                <MemberProgressCheck
                  member={member}
                  step="avatar"
                  size={6}
                  href="/member/photos"
                  label="Upload your Avatar"
                />
              </ListItem>
              <ListItem>
                <MemberProgressCheck
                  member={member}
                  step="avatar"
                  size={6}
                  href="/member/photos"
                  label="Upload your Avatar"
                />
              </ListItem>
            </List>
          </VStack>
        </Alert>
      </Box>
    </Page>
  )
}

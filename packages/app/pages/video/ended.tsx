import Page from 'components/Page'
import { Text, Heading, Box } from '@chakra-ui/react'
import { LinkButton } from 'components/controls'
export default function VideoChatEnded() {
  return (
    <Page title="Video Chat Ended">
      <Box textAlign="center">
        <Heading>Chat has ended</Heading>
        <Text my={6}>To rejoin the chat, please click the chat button in the footer.</Text>
        <LinkButton href="/video">Rejoin Video Chat</LinkButton>
      </Box>
    </Page>
  )
}

import Page from 'components/Page'
import { Text, Heading } from '@chakra-ui/react'
export default function ChatEnded() {
  return (
    <Page title="Chat Ended">
      <Heading>Chat has ended</Heading>
      <Text>To rejoin the chat, please click the chat button in the footer.</Text>
    </Page>
  )
}

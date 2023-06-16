import { ButtonLink } from 'components/controls'
import Page from 'components/Page'

import { Box, Heading, Text } from '@chakra-ui/react'

export default function VideoChatEnded() {
  return (
    <Page title="Video Chat Ended">
      <Box textAlign="center">
        <Heading>Chat has ended</Heading>
        <Text my={6}>
          To rejoin the chat, please click the chat button in the footer.
        </Text>
        <ButtonLink href="/video">Rejoin Video Chat</ButtonLink>
      </Box>
    </Page>
  )
}

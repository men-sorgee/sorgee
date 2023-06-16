import { ButtonLink } from 'components/controls'
import Page from 'components/Page'

import { Heading, Text } from '@chakra-ui/react'

export default function NotFound() {
  return (
    <Page title="404" textAlign="center">
      <Heading>Page Not Found</Heading>
      <Text my={20}>This page does not seem to exist.</Text>
      <ButtonLink href="/">Go Home</ButtonLink>
    </Page>
  )
}

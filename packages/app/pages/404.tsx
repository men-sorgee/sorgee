import { Box, Heading, Text } from '@chakra-ui/react'
import { useMeta } from 'hooks/use-meta'
import { useEffect } from 'react'
import { LinkButton } from '../components/ui'

export default function NotFound() {
  const { setMeta } = useMeta()

  useEffect(() => {
    setMeta('Not Found')
  })
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, secondary.400, secondary.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={'gray.500'} mb={6}>
        This page does not seem to exist.
      </Text>

      <LinkButton
        href="/"
        colorScheme="accent"
        bgGradient="linear(to-r, secondary.400, secondary.500, secondary.600)"
        color="white"
        variant="solid"
      >
        Go to Home
      </LinkButton>
    </Box>
  )
}

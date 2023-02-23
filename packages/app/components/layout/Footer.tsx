import { Box, Stack, HStack, Link, useColorModeValue, VisuallyHidden, Text } from '@chakra-ui/react'
import { constrained } from '.'
import { DiscordIcon, InstagramIcon, TwitterIcon } from '../icons'

export default function Footer() {
  return (
    <div className="no-print">
      <Box w="full" p={4}>
        <Stack
          alignItems="center"
          justify="space-between"
          direction={['column', 'column', 'row']}
          borderTop={'1px solid'}
          borderColor={useColorModeValue('primary.500', 'accent.500')}
          pt={4}
          __css={constrained}
        >
          <HStack spacing={5}>
            <Link href="https://www.instagram.com/guysnheat/" target={'_blank'} rel="noreferrer">
              <VisuallyHidden>Instagram</VisuallyHidden>
              <InstagramIcon />
            </Link>

            <Link href="https://twitter.com/guysnheat" target={'_blank'} rel="noreferrer">
              <VisuallyHidden>Twitter</VisuallyHidden>
              <TwitterIcon />
            </Link>

            <Link href="https://discord.gg/zMbwypyKgD" target={'_blank'} rel="noreferrer">
              <VisuallyHidden>Discord</VisuallyHidden>
              <DiscordIcon />
            </Link>
          </HStack>
          <HStack my={3} fontSize={'sm'} fontWeight="semibold" textTransform="uppercase">
            <Link
              href="/terms"
              pr={3}
              borderRight={'solid 1px'}
              borderColor={useColorModeValue('gray.500', 'white')}
            >
              Terms of service
            </Link>
            <Link href="/privacy">Privacy policy</Link>
          </HStack>

          <Text
            fontSize={'sm'}
            fontWeight="semibold"
            color={useColorModeValue('gray.500', 'gray.100')}
          >
            &copy; Guys N Heat 2023. All rights reserved.
          </Text>
        </Stack>
      </Box>
    </div>
  )
}

import { Box, Flex, HStack, Link, useColorModeValue, VisuallyHidden, Text } from '@chakra-ui/react'
import { constrained } from '.'
import { DiscordIcon, InstagramIcon, TwitterIcon } from '../icons'

export default function Footer() {
  return (
    <Box w="full" px={4}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        alignItems="center"
        justify="space-between"
        __css={constrained}
      >
        <HStack spacing={5}>
          <Link
            href="https://www.instagram.com/guysnheat/"
            target={'_blank'}
            rel="noreferrer"
            className="text-gray-200 hover:text-gray-100"
          >
            <VisuallyHidden>Instagram</VisuallyHidden>
            <InstagramIcon className="h-6 w-6" />
          </Link>

          <Link
            href="https://twitter.com/guysnheat"
            target={'_blank'}
            rel="noreferrer"
            className="text-gray-200 hover:text-gray-100"
          >
            <VisuallyHidden>Twitter</VisuallyHidden>
            <TwitterIcon className="h-6 w-6" />
          </Link>

          <Link
            href="https://discord.gg/zMbwypyKgD"
            target={'_blank'}
            rel="noreferrer"
            className="text-gray-200 hover:text-gray-100"
          >
            <VisuallyHidden>Discord</VisuallyHidden>
            <DiscordIcon className="h-6 w-6" />
          </Link>
        </HStack>
        <HStack my={3} fontSize={'sm'}>
          <Link
            href="/terms"
            className="mr-5 cursor-pointer border-r border-gray-700  pr-5 text-gray-500 no-underline hover:text-gray-200"
          >
            Terms of service
          </Link>

          <Link
            href="/privacy"
            className="mr-5 cursor-pointer pr-5 text-gray-500 no-underline  hover:text-gray-200"
          >
            Privacy policy
          </Link>
        </HStack>

        <Text color={useColorModeValue('gray.500', 'gray.100')}>
          &copy; Guys N Heat 2022. All rights reserved.
        </Text>
      </Flex>
    </Box>
  )
}

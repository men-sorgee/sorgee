import { UserGroupIcon } from '@heroicons/react/outline'
import {
  useColorMode,
  useColorModeValue,
  HStack,
  IconButton,
  Flex,
  Collapse,
  Link,
} from '@chakra-ui/react'
import { Box, BoxProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { constrained } from '.'
import { useMember } from 'hooks/use-member'
export type Props = BoxProps & {
  currentPath: string
}

export default function ActionsNav({ children, currentPath, ...props }: Props) {
  const { member, loading } = useMember()
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!loading && !show && member) {
      setShow(true)
    }
  }, [loading, member, show])

  if (!show) return <></>

  return (
    <>
      <Box
        {...props}
        as="nav"
        color={'white'}
        position="absolute"
        bottom={0}
        zIndex={100}
        width="100%"
        shadow="xl"
        bg={useColorModeValue('primary.800', 'black')}
      >
        <HStack
          minH={'80px'}
          alignItems="center"
          justifyItems="space-between"
          align="center"
          spacing={4}
          __css={constrained}
        >
          <Link href="/members">
            <IconButton
              variant="ghost"
              size="lg"
              icon={<UserGroupIcon />}
              color={currentPath === '/members' ? 'accent.500' : 'white'}
              aria-label={'View Members'}
            />
          </Link>
        </HStack>
      </Box>
    </>
  )
}

import { UserGroupIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import { useColorModeValue, IconButton, Spacer, Flex, Link, Badge } from '@chakra-ui/react'
import { Box, BoxProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { constrained } from '..'
import NextLink from 'next/link'
import { useUser } from 'hooks'
import Notifications from './Notifications'
import Messages from './Messages'
import Events from './Events'
import { MemberLevel } from 'lib/models'

export type Props = BoxProps & {}

export default function ActionsNav({ children, ...props }: Props) {
  const router = useRouter()
  const { authenticated, isMember, member, level } = useUser()
  const [path, setPath] = useState(router.asPath)

  useEffect(() => {
    setPath(router.asPath)
  }, [router, router.asPath, authenticated])

  const bgColor = useColorModeValue('primary.800', 'black')
  const borderColor = useColorModeValue('primary.500', 'accent.400')
  const user_count = 0
  if (!authenticated || !isMember) return null

  return (
    <div className="no-print">
      <Box
        {...props}
        as="nav"
        color={'white'}
        width="100%"
        minH={'80px'}
        shadow="xl"
        bg={bgColor}
        borderTop="1px solid"
        borderTopColor={borderColor}
        position="fixed"
        zIndex="fixed"
        bottom={0}
        pr="16px"
      >
        <Flex justify="center" w="full" gap={10} p={4} {...constrained}>
          <Messages member={member} />

          <Events member={member} active={path.startsWith('/events')} />

          <Link href="/members" as={NextLink} zIndex="fixed">
            <IconButton
              variant="primary"
              size="lg"
              zIndex="fixed"
              icon={<UserGroupIcon height="50px" width="50px" />}
              color={path.startsWith('/members') ? 'accent.500' : 'white'}
              aria-label={'View Members'}
              title="View Members"
            />
          </Link>

          <Notifications member={member} />
        </Flex>
      </Box>
    </div>
  )
}

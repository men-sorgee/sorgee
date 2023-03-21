import React, { useEffect, useState, ReactNode } from 'react'
import { Flex, Box, Slide, useDisclosure, Spacer } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import Actions from './Actions'

import Splash from './Splash'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { useSession } from 'next-auth/react'
import { MemberLevel } from '../../lib/models'
export const constrained = {
  maxW: ['full', 'lg', '2xl', '3xl', '4xl', '5xl'],
  mx: 'auto',
}

function Layout({
  children,
  fonts: [heading, body, mono],
}: {
  children?: ReactNode
  className?: string
  fonts: any[]
}) {
  const { data: session, status } = useSession()
  const [authenticated, setAuthenticated] = useState<boolean>(undefined)
  const loading = status == 'loading'
  const router = useRouter()
  const [path] = useState<string>(router?.asPath)
  const height = authenticated ? '146px' : '75px'
  const { isOpen, onOpen } = useDisclosure()
  const level = MemberLevel[session?.user?.user_type || 'subscriber']
  useEffect(() => {
    if (!loading) {
      if (authenticated == undefined) {
        setAuthenticated(status == 'authenticated')
      }
      if (authenticated && !isOpen) {
        setTimeout(() => {
          onOpen()
        }, 1000)
      }
    }
  }, [status, authenticated, loading, onOpen, isOpen])

  if (path?.startsWith('/code')) {
    return <>{children}</>
  }
  return (
    <>
      <Meta />
      <Flex direction="column" flex="1" overflowX="clip">
        <ErrorBoundary>
          <Header />
          <Flex
            as="main"
            flex="1 100%"
            direction="column"
            maxH={`calc(100vh - ${height})`}
            overflowY="auto"
          >
            <Box
              position="relative"
              w="full"
              flex="1 100%"
              {...constrained}
              className={` ${heading} ${body} ${mono}}`}
            >
              <Box minH={`calc(80vh - ${height})`}>
                <ErrorBoundary>{children}</ErrorBoundary>
              </Box>
              <Spacer h="1rem" />
              <Footer />
            </Box>
          </Flex>
          {authenticated && level >= MemberLevel.pledge && (
            <Slide in={isOpen} direction="bottom">
              <Actions />
            </Slide>
          )}
        </ErrorBoundary>
      </Flex>
      {!loading && !authenticated && <Splash />}
    </>
  )
}

export default Layout

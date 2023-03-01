import React, { useEffect, useState } from 'react'
import { Flex, Box, Slide, useDisclosure, Spacer } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import Actions from './Actions'
import { useUser } from 'hooks/use-user'
import Splash from './Splash'
import { ErrorBoundary } from 'components/ErrorBoundary'
export const constrained = {
  maxW: ['full', 'lg', '2xl', '3xl', '4xl', '5xl'],
  mx: 'auto',
}

function Layout({
  children,
  fonts: [heading, body, mono],
}: {
  children?: React.ReactNode
  className?: string
  fonts: any[]
}) {
  const { authenticated } = useUser()
  const router = useRouter()
  const [path] = useState<string>(router?.asPath)
  const height = authenticated ? '146px' : '75px'
  const { isOpen, onOpen } = useDisclosure()

  useEffect(() => {
    if (authenticated)
      setTimeout(() => {
        onOpen()
      }, 1000)
  }, [authenticated, onOpen])

  if (path?.startsWith('/code')) {
    return <>{children}</>
  }
  return (
    <>
      <Meta />
      <Flex direction="column" flex="1" overflowX="clip">
        <ErrorBoundary>
          <Header />
          <Flex flex="1 100%" direction="column" maxH={`calc(100vh - ${height})`} overflowY="auto">
            <Box
              position="relative"
              w="full"
              flex="1 100%"
              {...constrained}
              className={` ${heading} ${body} ${mono}}`}
            >
              <ErrorBoundary>{children}</ErrorBoundary>
              <Spacer h="1rem" />
              <Footer />
            </Box>
          </Flex>
          {authenticated && (
            <Slide in={isOpen} direction="bottom">
              <Actions />
            </Slide>
          )}
        </ErrorBoundary>
      </Flex>
      <Splash authenticated={authenticated} />
    </>
  )
}

export default Layout

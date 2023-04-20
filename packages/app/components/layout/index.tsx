import React, { useEffect, useState, ReactNode, useRef } from 'react'
import { Flex, Box, Slide, useDisclosure, Spacer } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import Actions from './actions'
import Splash from './Splash'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { useUser } from 'hooks'
import { MemberLevel } from '../../lib/models'

export const constrained = {
  maxW: ['full', 'xl', '3xl', '4xl', '5xl'],
  mx: [2, 'auto'],
}

function Layout({
  children,
  fonts: [heading, body, mono],
}: {
  children?: ReactNode
  className?: string
  fonts: any[]
}) {
  const { authenticated, user, level, loading } = useUser()
  const router = useRouter()
  const [path] = useState<string>(router?.asPath)
  const { isOpen, onOpen } = useDisclosure()
  const showActions = authenticated && level >= MemberLevel.pledge
  useEffect(() => {
    if (!loading && authenticated) {
      if (showActions && !isOpen) {
        setTimeout(() => {
          onOpen()
        }, 1000)
      }
    }
  }, [authenticated, loading, onOpen, isOpen, showActions, level])
  const headerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleRouteChange = () => {
      setTimeout(() => {
        if (headerRef.current != null) {
          headerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 100)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, loading, authenticated, level, showActions, isOpen])

  if (path?.startsWith('/code')) {
    return <>{children}</>
  }

  return (
    <>
      <Meta />
      <Flex direction="column" flex="1" overflowX="clip">
        <ErrorBoundary>
          <Header userType={user?.user_type} />
          <Flex
            as="main"
            flex="1 100%"
            direction="column"
            maxH={`calc(100vh - ${showActions ? '146px' : '75px'})`}
            overflowY="auto"
            overflowX="hidden"
            w="full"
          >
            <Box
              position="relative"
              w="full"
              flex="1 100%"
              className={` ${heading} ${body} ${mono}}`}
              {...constrained}
            >
              <Box minH={`calc(80vh - ${showActions ? '146px' : '75px'})`} ref={headerRef}>
                {children}
              </Box>
              <Spacer h="1rem" />
              <Footer />
            </Box>
          </Flex>
          {showActions && (
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

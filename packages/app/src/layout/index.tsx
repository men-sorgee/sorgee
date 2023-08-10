import { useUser } from "hooks";
import { brand } from "lib/config/brand";
import { MemberLevel } from "lib/models";
import { useRouter } from "next/router";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { Box, Flex, Slide, Spacer, useDisclosure } from "@chakra-ui/react";

import Actions from "./actions";
import { ErrorBoundary } from "./components";
import Footer from "./Footer";
import Header from "./Header";
import Meta from "./Meta";
import Splash from "./Splash";

export const constrained = {
  maxW: brand.breakPoints,
  mx: [2, 'auto']
}

function Layout({
  children,
  fonts: [heading, body, mono]
}: {
  children?: ReactNode
  className?: string
  fonts: any[]
}) {
  const { authenticated, member, level, loading } = useUser({
    redirectsEnabled: false
  })
  const router = useRouter()
  const [path, setPath] = useState<string>()
  const [hideFooter, setHideFooter] = useState<boolean>(false)
  const { isOpen, onOpen } = useDisclosure()
  const showActions = authenticated && level >= MemberLevel.pledge
  useEffect(() => {
    if (path == undefined) {
      setPath(router?.asPath)
    }
    if (!loading && authenticated) {
      if (showActions && !isOpen) {
        setTimeout(() => {
          onOpen()
        }, 1000)
      }
    }
  }, [
    authenticated,
    loading,
    onOpen,
    isOpen,
    showActions,
    level,
    path,
    router?.asPath
  ])
  const headerRef = useRef<HTMLDivElement>(null)

  const handleRouteChange = useCallback((url: string) => {
    setHideFooter(url.startsWith('/members/chat') || url.endsWith('/ticket'))
    setTimeout(() => {
      if (headerRef.current != null) {
        headerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 100)
  }, [])

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [
    router.events,
    loading,
    authenticated,
    level,
    showActions,
    isOpen,
    handleRouteChange
  ])

  if (path?.startsWith('/code')) {
    return <>{children}</>
  }

  return (
    <>
      <Meta />
      <Flex direction="column" flex="1" overflowX="clip">
        <Header isAuthenticated={authenticated} userType={member?.user_type} />
        <Flex
          as="main"
          flex="1 100%"
          direction="column"
          maxH={`calc(100vh - ${showActions ? '146px' : '75px'})`}
          overflowY={'auto'}
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
            <Box
              minH={`calc(80vh - ${showActions ? '146px' : '75px'})`}
              ref={headerRef}
            >
              <ErrorBoundary>{children}</ErrorBoundary>
            </Box>
            {!hideFooter && (
              <>
                <Spacer h="1rem" />
                <Footer />
              </>
            )}
          </Box>
        </Flex>
        <ErrorBoundary>
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

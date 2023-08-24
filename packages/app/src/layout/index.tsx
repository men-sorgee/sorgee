import { useSite, useUser } from "hooks";
import { brand } from "lib/config/brand";
import { MemberLevel } from "lib/models";
import { Router } from "next/router";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  HStack,
  Slide,
  Spacer,
  Text,
  useDisclosure
} from "@chakra-ui/react";

import { Markdown } from "../components";
import { postJSON } from "../lib/utils";
import Actions from "./actions";
import Footer from "./Footer";
import Header from "./Header";
import Meta from "./Meta";
import Splash from "./Splash";

export const constrained = {
  maxW: brand.breakPoints,
  mx: [2, 'auto'],
}

export default function Layout({
  router,
  children,
  fonts: [heading, body, mono],
}: {
  router: Router,
  children?: ReactNode
  className?: string
  fonts: any[]
}) {
  const { authenticated, member, level, loading } = useUser({
    redirectsEnabled: false,
  })

  const [path, setPath] = useState<string>()
  const [hideFooter, setHideFooter] = useState<boolean>(false)
  const { isOpen, onOpen } = useDisclosure()
  const { site } = useSite()

  const showActions = useMemo(() => authenticated && level >= MemberLevel.pledge, [authenticated, level])

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
  }, [authenticated, loading, onOpen, isOpen, showActions, level, path, router?.asPath])

  const headerRef = useRef<HTMLDivElement>(null)

  const handleRouteChange = useCallback((url: string) => {
    setHideFooter(url.startsWith('/members/chat') || url.endsWith('/ticket'))
    setTimeout(() => {
      if (headerRef.current != null) {
        headerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 100)
  }, [])

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, loading, authenticated, level, showActions, isOpen, handleRouteChange])

  if (path?.startsWith('/code')) {
    return <>{children}</>
  }

  const Error = ({ error }: { error: string }) => (
    <Box mx={[4, 4, 0]}>
      <h2>Something went wrong!</h2>
      <Text>{error}</Text>
    </Box>
  )

  return (
    <>
      <Meta />
      <Flex direction="column" flex="1" overflowX="clip">
        {site && <Header router={router} site={site} isAuthenticated={authenticated} userType={member?.user_type} />}
        <ErrorBoundary
          fallbackRender={Error}
          onError={(error, errorInfo) => {
            postJSON('/api/errors', { error, errorInfo }).catch(console.error)
          }}
        >
          {site?.announcement && <Alert status="info">

            <HStack {...constrained}>
              <AlertIcon />
              <Markdown content={site?.announcement} m={0} />
            </HStack>
          </Alert>}
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

              <Box minH={`calc(80vh - ${showActions ? '146px' : '75px'})`} ref={headerRef}>

                {children}
              </Box>
              {!hideFooter && (
                <>
                  <Spacer h="1rem" />
                  <Footer />
                </>
              )}
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

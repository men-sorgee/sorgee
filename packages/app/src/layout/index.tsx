'use client'

import { useSite, useUser } from "hooks";
import { ViewHeightContext } from "hooks/use-view-height";
import { brand } from "lib/config/brand";
import { MemberLevel } from "lib/models";
import { logEvent, postJSON } from "lib/utils";
import { useRouter } from "next/router";
import {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Box, Flex, Slide, Text, useDisclosure } from "@chakra-ui/react";

import Actions from "./actions";
import { Announcement } from "./components/Announcement";
import Footer from "./Footer";
import Header from "./Header";
import Meta from "./Meta";
import Splash from "./Splash";

export const constrained = {
  maxW: brand.breakPoints,
  mx: [2, 'auto'],
}

export default function Layout({
  children,
  fonts: [heading, body, mono],
}: {
  children?: ReactNode
  className?: string
  fonts: any[]
}) {
  const { authenticated, member, level, loading } = useUser({
    redirectsEnabled: false,
  })
  const router = useRouter()
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

  const bodyRef = useRef<HTMLDivElement>(null)

  const handleRouteChange = useCallback((url: string) => {
    startTransition(() => {
      logEvent('page_view', { url })

      setHideFooter(url.startsWith('/members/chat') || url.endsWith('/ticket'))

      setTimeout(() => {
        if (bodyRef.current != null) {
          bodyRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 100)
    })
  }, [])

  useEffect(() => {
    if (router?.asPath == undefined) return
    startTransition(() => {
      setHideFooter(router?.asPath.startsWith('/members/chat') || router?.asPath.endsWith('/ticket') || false)
    })

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router?.events, loading, authenticated, level, showActions, isOpen, handleRouteChange, router?.asPath])

  const [heightSubtraction, setHeightSubtraction] = useState<number>(0)
  const headerRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const announcementRef = useRef<HTMLDivElement>(null)
  const [screenSize, setScreenSize] = useState<number>(window?.innerWidth)

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenSize(window.innerWidth)
    });
    return () => {
      window.removeEventListener("resize", () => {
        setScreenSize(window.innerWidth)
      })
    }
  }, []);

  useEffect(() => {
    let reduceBy = (headerRef?.current?.clientHeight || 80) +
      (actionsRef?.current?.clientHeight || 0) +
      (announcementRef?.current?.clientHeight || 0)

    if (announcementRef?.current)
      reduceBy += 12

    if (reduceBy != heightSubtraction) {
      setHeightSubtraction(reduceBy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerRef?.current, actionsRef?.current, announcementRef?.current, heightSubtraction, screenSize])

  const viewHeight = useMemo(() => `calc(100vh - ${heightSubtraction}px)`, [heightSubtraction])

  const Error = ({ error }: { error: string }) => (
    <Box mx={[4, 4, 0]}>
      <h2>Something went wrong!</h2>
      <Text>{error}</Text>
    </Box>
  )

  if (router?.pathname.startsWith('/code')) {
    return <>{children}</>
  }

  return (
    <>
      <Meta />
      <Flex direction="column" flex="1">
        {site && <Header ref={headerRef} site={site} isAuthenticated={authenticated} userType={member?.user_type} />}
        <ErrorBoundary
          fallbackRender={Error}
          onError={(error, errorInfo) => {
            postJSON('/api/errors', { error, errorInfo }).catch(console.error)
          }}
        >
          {site?.announcement && <Announcement ref={announcementRef} constrained={constrained} announcement={site?.announcement} />}
          <Flex
            as="main"
            flex="1 100%"
            direction="column"
            maxH={viewHeight}
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
              <Box ref={bodyRef}>
                <ViewHeightContext.Provider value={{ subtract: heightSubtraction }}>{children}</ViewHeightContext.Provider>
              </Box>
              {!hideFooter && (
                <Footer />
              )}
            </Box>
          </Flex>

          {showActions && (
            <Slide in={isOpen} direction="bottom">
              <Actions ref={actionsRef} />
            </Slide>
          )}
        </ErrorBoundary>
      </Flex>
      {!loading && !authenticated && <Splash />}
    </>
  )
}


import React, { useEffect, useState } from 'react'
import { Flex, Box, Spacer, Slide, useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import Actions from './Actions'
import { useUser } from '../../hooks/use-user'

export const constrained = {
  maxW: ['full', 'lg', '2xl', '3xl', '4xl', '5xl'],
  mx: 'auto',
  p: 4,
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

  const height = authenticated ? '160px' : '85px'
  const { isOpen, onOpen } = useDisclosure()

  useEffect(() => {
    if (authenticated)
      setTimeout(() => {
        onOpen()
      }, 3000)
  }, [authenticated, onOpen])

  if (path?.startsWith('/code')) {
    return <>{children}</>
  }
  return (
    <>
      <Meta />
      <Flex direction="column" flex="1" overflowX="clip">
        <Header />
        <Flex flex="1 100%" direction="column" maxH={`calc(100vh - ${height})`} overflowY="auto">
          <Box w="full" flex="1 100%" {...constrained} className={` ${heading} ${body} ${mono}}`}>
            {children}
          </Box>
          <Spacer />
          <Footer />
        </Flex>

        <Slide in={isOpen} direction="bottom">
          <Actions />
        </Slide>
      </Flex>
    </>
  )
}

export default Layout

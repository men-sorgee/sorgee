import React, { useEffect, useState } from 'react'
import { Flex, Box, Spacer } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import Actions from './Actions'
import { useAuth } from 'hooks'
export const constrained = {
  maxW: ['full', '2xl', '3xl', '4xl'],
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
  const { isMember } = useAuth()
  const router = useRouter()
  const [path] = useState<string>(router?.asPath)
  if (path?.startsWith('/code')) {
    return <>{children}</>
  }
  const height = isMember ? '160px' : '85px'
  return (
    <>
      <Meta />
      <Flex direction="column" flex="1" overflowX="clip">
        <Header />
        <Flex
          flex="1"
          direction="column"
          minH="70vh"
          maxH={`calc(100vh - ${height})`}
          overflowY="auto"
        >
          <Box flex="1" {...constrained} className={` ${heading} ${body} ${mono}}`}>
            {children}
          </Box>
          <Spacer />
          <Footer />
        </Flex>
        {isMember && <Actions currentPath={path} />}
      </Flex>
    </>
  )
}

export default Layout

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
  const [className, setClassName] = useState<string>()
  const [path, setPath] = useState<string>()
  useEffect(() => {
    if (router?.asPath) {
      let path = router.asPath
      if (path == '/') path = '/home'
      setPath(path)
      let name = path.substring(1).split('/').join('-').toLowerCase()
      setClassName(name)
    }
  }, [router, path, className])

  if (path?.startsWith('/code')) {
    return <>{children}</>
  }
  const height = isMember ? '160px' : '85px'
  return (
    <>
      <Meta />
      <Flex direction="column" flex="1" overflowX="clip">
        <Header />
        <Box maxH={`calc(100vh - ${height})`} overflowY="auto">
          <Box
            flex="1"
            {...constrained}
            className={`${className || ''} ${heading} ${body} ${mono}}`}
          >
            {children}
          </Box>
          <Spacer />
          <Footer />
        </Box>
        {isMember && <Actions currentPath={path} />}
      </Flex>
    </>
  )
}

export default Layout

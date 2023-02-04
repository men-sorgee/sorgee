import React, { useEffect, useState } from 'react'
import { Flex, Container } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import Actions from './Actions'

export const constrained = {
  maxW: ['full', '4xl', '5xl', '6xl'],
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
  const router = useRouter()
  const [className, setClassName] = useState<string>()
  const [path, setPath] = useState<string>()
  useEffect(() => {
    if (router?.asPath && !path && !className) {
      let path = router.asPath
      if (path == '/') path = '/home'
      setPath(path)
      let name = path.substring(1).split('/').join('-').toLowerCase()
      setClassName(name)
    }
  }, [router, router?.pathname, className])

  if (path?.startsWith('/code')) {
    return <>{children}</>
  }
  return (
    <>
      <Meta />
      <Flex direction="column" flex="1" overflowX="clip">
        <Header />
        <Container
          className={`${className || ''} ${heading} ${body} ${mono}}`}
          minH="50vh"
          overflow="scroll-y"
        >
          {children}
        </Container>
        <Footer />
        <Actions currentPath={path} />
      </Flex>
    </>
  )
}

export default Layout

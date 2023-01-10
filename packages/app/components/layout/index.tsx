import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'

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

  useEffect(() => {
    if (router?.asPath && !className) {
      let path = router.asPath
      if (path == '/') path = '/home'
      let name = path.substring(1).split('/').join('-').toLowerCase()
      setClassName(name)
    }
  }, [router, router?.pathname, className])

  return (
    <>
      <Meta />
      <Header />
      <Box minH={'80vh'} className={`${className || ''} ${heading} ${body} ${mono}}`}>
        <Box as="main" {...constrained} mx={['1', '2', 'auto']}>
          {children}
        </Box>
      </Box>
      <Footer />
    </>
  )
}

export default Layout

import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'

export const constrained = {
  maxW: { base: '90%', md: '4xl', lg: '5xl', xl: '6xl' },
  mx: 'auto',
  px: {
    base: 4,
    xl: 0,
  },
  py: 4,
  minW: '370px',
}

function Layout({
  children,
  style = {},
  fonts: [heading, body, mono],
}: {
  children?: React.ReactNode
  className?: string
  style?: any
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
      <Box
        minH={'80vh'}
        __css={constrained}
        className={`${className || ''} ${heading} ${body} ${mono}}`}
      >
        <main style={style} className={className || ''}>
          {children}
        </main>
      </Box>
      <Footer />
    </>
  )
}

export default Layout

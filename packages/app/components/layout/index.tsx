import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import User from './User'
import { useRouter } from 'next/router'

export const constrained = {
  maxW: { md: '3xl', xl: '4xl' },
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
}: {
  children?: React.ReactNode
  className?: string
  style?: any
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
      <Header>
        <User />
      </Header>
      <Box minH={'80vh'} __css={constrained}>
        <main style={style} className={className || ''}>
          {children}
        </main>
      </Box>
      <Footer />
    </>
  )
}

export default Layout

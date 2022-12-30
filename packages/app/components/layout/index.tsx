import React, { useState } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box,
  IconButton,
  Container,
} from '@chakra-ui/react'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'

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
  return (
    <>
      <Meta />
      <Header />
      <Box h={'max'} __css={constrained}>
        <main style={style}>{children}</main>
      </Box>
      <Footer />
    </>
  )
}

export default Layout

import React, { useState } from 'react'
import { Drawer } from 'react-daisyui'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import Menu from './Menu'
import Document from 'next/document'

export default function Layout({
  children,
  className = '',
  style = {},
}: {
  children?: React.ReactNode
  className?: string
  style?: any
}) {
  const [visible, setVisible] = useState(false)
  const toggleDrawer = () => {
    setVisible(!visible)
  }
  const classes = `container ${className}`
  return (
    <>
      <Meta />
      <div style={style}>
        <Header
          {...{
            toggleDrawer,
            visible,
            setVisible,
          }}
        />
        <Drawer open={visible} onClickOverlay={toggleDrawer} side={<Menu />}>
          <div className={classes}>
            <main style={style}>{children}</main>
            <Footer />
          </div>
        </Drawer>
      </div>
    </>
  )
}

import React, { useState } from 'react'
import { Drawer } from 'react-daisyui'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import Menu from './Menu'

export default function Layout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [visible, setVisible] = useState(false)
  const toggleDrawer = () => {
    setVisible(!visible)
  }
  const classes = `container ${className}`
  return (
    <>
      <Meta />
      <Header
        {...{
          toggleDrawer,
          visible,
          setVisible,
        }}
      />
      <Drawer open={visible} onClickOverlay={toggleDrawer} side={<Menu />}>
        <div className={classes}>
          <main>{children}</main>
          <Footer />
        </div>
      </Drawer>
    </>
  )
}

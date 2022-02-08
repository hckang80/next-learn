import React, { type ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  className?: string
}

function Layout ({ children, className }: Props) {
  return (
    <>
      <Head>
        <title>ZIGZAG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`main-container ${className}`}>{children}</main>
    </>
  )
}

Layout.defaultProps = {
  className: ''
}

export default Layout

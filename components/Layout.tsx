import React, { type ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  children?: ReactNode
}

function Layout ({ children }: Props) {
  return (
    <>
      <Head>
        <title>ZIGZAG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main-container">{children}</main>
    </>
  )
}

export default Layout

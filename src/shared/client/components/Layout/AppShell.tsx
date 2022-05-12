import React from "react"

import Head from "next/head"

import Footer from "./Footer"
import Header from "./Header/Header"

const AppShell = ({ children }) => {
  return (
    <div className="bg-purple-50">
      <Head>
        <title>Narcissa</title>
      </Head>

      <Header />

      {children}

      <Footer
        layout="horizontal"
        className="justify-end sm:justify-between"
      ></Footer>
    </div>
  )
}

export default AppShell

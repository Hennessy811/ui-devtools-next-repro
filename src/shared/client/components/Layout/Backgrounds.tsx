import React from "react"

const Backgrounds = () => {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/universe_background_mobile.png"
        alt="Universe Background Mobile"
        className="fixed top-0 left-0 -z-10 h-screen w-screen object-cover sm:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/universe_background_desktop.png"
        alt="Universe Background"
        className="fixed top-0 left-0 -z-10 hidden h-screen w-screen object-cover sm:block"
      />
    </>
  )
}

export default Backgrounds

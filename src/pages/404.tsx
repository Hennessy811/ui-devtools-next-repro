import React from "react"

import Head from "next/head"
import { useRouter } from "next/router"
import { ChevronLeft } from "tabler-icons-react"

const NotFound = () => {
  const router = useRouter()

  return (
    <div className="relative min-h-screen w-screen">
      <Head>
        <title>Narcissa | 404</title>
      </Head>

      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="overflow-hidden rounded-lg border border-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="NFT" src="/img/NFT.png" className="w-[300px]" />
        </div>
        <div className="mt-8 border-t-2 border-b-2 border-primary-500 py-2 font-VT323 text-2xl text-primary-500">
          Coming soon
        </div>

        <button
          onClick={() => router.back()}
          className="btn-primary mt-8 flex items-center justify-center px-4 py-2 text-2xl"
        >
          <ChevronLeft />
          Back
        </button>
      </div>
    </div>
  )
}

export default NotFound

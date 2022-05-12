import React from "react"

import axios from "axios"
import { motion } from "framer-motion"
import { GetStaticProps } from "next"
import { Plus } from "tabler-icons-react"

import { headers, NARCISSA_API } from "@shared/server/constants"

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
}

const Communities = ({ data }: { data: any }) => {
  // const pages = usePages()
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="relative m-auto flex min-h-screen max-w-6xl flex-col space-y-4 py-16 px-4 sm:px-16 lg:flex-row lg:space-y-0 lg:space-x-4"
    >
      <ConnectionsCard />

      <div className="relative min-h-min bg-white">
        <div className="bg-primary py-5 px-14 text-4xl font-bold uppercase text-white">
          Communities
        </div>

        <div className="my-7 flex items-center space-x-2 px-6">
          <input
            type="text"
            className="w-full rounded-lg border border-secondary-100"
            placeholder="Search for a community…"
          />

          <a
            href="https://airtable.com/shrU0y4sHKzqVUGH5"
            target="_blank"
            rel="noreferrer"
          >
            <button className="btn-primary min-w-min">
              <p className="whitespace-nowrap">Add my community</p>
              <Plus />
            </button>
          </a>
        </div>

        <div className="grid grid-flow-row grid-cols-1 gap-4 px-6 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          <div>
            <h1>Lorem Ipsum</h1>
          </div>
        </div>
      </div>
    </motion.main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const url = `${NARCISSA_API}/posts`

  const response = await axios({ url, headers })

  return { props: { data: response?.data?.data || null }, revalidate: 30 }
}

export default Communities

const ConnectionsCard = () => {
  return (
    <div className="relative h-fit w-full max-w-xs bg-white pb-4">
      <div className="bg-secondary px-11 py-5 text-4xl font-bold uppercase text-white">
        Connect
      </div>

      <div className="p-6">
        <p className="mb-4 text-xl font-medium uppercase italic">
          CONNECT YOUR SOCIALS TO CLAIM ASSOCIATED REWARDS.
        </p>
      </div>
    </div>
  )
}

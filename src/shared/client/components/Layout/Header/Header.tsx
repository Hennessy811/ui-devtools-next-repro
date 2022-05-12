import React from "react"

import Image from "next/image"
import Link from "next/link"

interface Props {}

const Header = ({}: Props) => {
  return (
    <div className="relative bg-gradient-to-t from-background-500 to-background-800 px-4 pt-3 pb-4">
      <div className="relative flex items-center justify-between">
        <Link href="/" passHref>
          <a className="flex">
            <Image
              alt="Logo"
              src="/img/Logo.png"
              width={237}
              height={48}
              objectFit="cover"
              priority
            />
          </a>
        </Link>

        {/* Links */}

        <div className="flex items-center justify-end space-x-4">
          <div className="mr-6 hidden items-center justify-center space-x-12 text-lg uppercase text-white sm:flex">
            <Link href="/">
              <a className="hover:text-primary-500 hover:underline">
                Communities
              </a>
            </Link>
            <Link href="/communities/any/questions">
              <a className="hover:text-primary-500 hover:underline">Forum</a>
            </Link>
            <a
              href="https://docs.narcissa.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 hover:underline"
            >
              Docs
            </a>
            <a
              href="https://www.getrevue.co/profile/narcissa"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 hover:underline"
            >
              Lore
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header

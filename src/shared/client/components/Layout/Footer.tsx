import React from "react"

import Image from "next/image"
import Link from "next/link"

const links = [
  {
    href: "/",
    label: "Communities",
    sameTab: true,
  },
  {
    href: "/communities/any/questions",
    label: "Forum",
    sameTab: true,
  },
  {
    href: "https://docs.narcissa.xyz",
    label: "Docs",
  },
  {
    href: "https://www.getrevue.co/profile/narcissa",
    label: "Lore",
  },
]

const socials = [
  {
    href: "https://discord.gg/rmTjw2DQnH",
    label: "Discord",
  },
  {
    href: "https://twitter.com/narcissanetwork",
    label: "Twitter",
  },
  {
    href: "mailto:victor@narcissa.xyz",
    label: "Mail",
  },
]

interface Props {
  children?: React.ReactNode
  layout?: "vertical" | "horizontal"
  className?: string
}

// const Footer = ({ children, layout = "vertical", className }: Props) => {
//   return (
//     <div
//       className={clsx(
//         "relative flex w-full flex-wrap bg-gradient-to-b from-background-500 to-background-800 px-6 py-4 sm:px-12 sm:py-6",
//         className
//       )}
//     >
//       {children}

//       <div
//         className={clsx(
//           "relative flex flex-wrap justify-end uppercase text-primary-500",
//           layout === "horizontal" && "flex-row space-x-4",
//           layout === "vertical" && "flex-col items-end space-y-2"
//         )}
//       >
//         {links.map((link) => (
//           <Link passHref href={link.href} key={link.label}>
//             <a
//               target={!link.sameTab ? "_blank" : undefined}
//               rel="noopener noreferrer"
//               className="hover:underline"
//             >
//               {link.label}
//             </a>
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }

const Footer = ({ children, layout = "vertical", className }: Props) => {
  return (
    <div className="flex justify-between bg-gradient-to-b from-secondary to-background-800 p-11">
      <div className="">
        <Image
          alt="Logo"
          src="/img/Logo.png"
          width={237}
          height={48}
          objectFit="cover"
          priority
        />
        <p className="text-center text-white">@ 2690 NARCISSA</p>
      </div>

      <div className="flex space-x-24 text-white">
        <div className="flex flex-col space-y-8">
          {links.map((link) => (
            <Link href={link.href} key={link.label}>
              <a
                target={!link.sameTab ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="uppercase hover:underline"
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>
        <div className="flex flex-col space-y-8">
          {socials.map((link) => (
            <Link href={link.href} key={link.label}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="uppercase hover:underline"
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Footer

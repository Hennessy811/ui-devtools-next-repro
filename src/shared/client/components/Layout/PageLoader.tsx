import React from "react"

import { motion } from "framer-motion"
import { random } from "lodash"

const listOfFacts = [
  "Time stops at the speed of light.",
  "The average human body carries more bacteria cells than human cells.",
  "In their lifetime, the average person walks the equivalent of five times around the Earth.",
  "Humans wouldn’t be able to taste food without saliva.",
  "If Betelgeuse exploded right now, the star’s last light show would brighten our sky for around two months.",
  "Oona Chaplin, who played Robb Stark’s wife in Game of Thrones, is Charlie Chaplin’s granddaughter.",
  "The founder of sportswear companies Puma and Adidas were brothers! Rudolf “Rudi” Dassler is the brain behind Puma, while his big bro Adolf “Adi” Dassler gave the world Adidas.",
  "The only letter of the alphabet that doesn’t appear in any American state is q.",
  "The original Ferris Wheel was designed and constructed in Chicago, Illinois, by George Washington Gale Ferris, Jr.",
  "While SPAM is most popular in Hawaii, it was actually invented in Minnesota. The state even serves as home to the SPAM museum!",
  "Glaciers, ice caps, and ice sheets hold nearly 69 percent of the world’s freshwater.",
  "Whale songs can be used by scientists to sonically map out the ocean floor.",
  "The first person charged with speeding in a vehicle was going eight miles per hour.",
  "Hair and nails typically grow faster during pregnancy.",
  "Cardinals cover themselves in ants to get rid of lice and other harmful parasites that might be in their feathers.",
]

const PageLoader = ({ loading, route }) => {
  const fact = listOfFacts[random(listOfFacts.length - 1, false)]

  return loading ? (
    <>
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "hidden",
          width: "100vw",
          height: "100vh",
          background: "black",
          opacity: 0.6,
          z: 9999,
        }}
        initial={{
          background:
            "linear-gradient(0deg, rgba(78,255,228,1) 0%, rgba(183,82,255,1) 100%)",
        }}
        animate={{
          background:
            "linear-gradient(360deg, rgba(78,255,228,1) 0%, rgba(183,82,255,1) 100%)",
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          bounce: 0,
          ease: "easeIn",
        }}
      ></motion.div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="flex-col space-y-6"
      >
        <div className="flex flex-col">
          <p className="text-semibold text-border font-VT323 text-6xl text-white">
            Loading...
          </p>
          <p className="text-border font-VT323 text-white">{route}</p>
        </div>

        <p className="text-border max-w-md text-center text-3xl font-semibold text-white">
          {fact}
        </p>
      </div>
    </>
  ) : null
}
// <>
//   <Transition
//     show={loading}
//     enter="transition ease-out duration-300 transform"
//     enterFrom="fixed z-50 -top-1/2 -left-1/2 opacity-0 scale-95"
//     enterTo="fixed z-50 -top-1/2 -left-1/2 opacity-100 scale-100"
//     leave="transition ease-in duration-300 transform"
//     leaveFrom="fixed z-50 -top-1/2 -left-1/2 opacity-100 scale-100"
//     leaveTo="fixed z-50 -top-1/2 -left-1/2 opacity-0 scale-95"
//   >
//     <div className="z-50 h-[200vh] w-[200vw] animate-spin bg-gradient-to-br from-cyan-400 to-purple-400 opacity-70 duration-75" />
//   </Transition>
//   {loading && (
//     <p className="fixed top-0 left-0 z-[60] flex h-screen w-screen items-center justify-center">
//       <span className="text-center text-4xl font-semibold text-white">
//         Loading...
//         <br />
//         <span className="text-border font-VT323">{route}</span>
//       </span>
//     </p>
//   )}
// </>

export default PageLoader

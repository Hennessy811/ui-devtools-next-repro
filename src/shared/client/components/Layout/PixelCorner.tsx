import clsx from "clsx"
import { motion } from "framer-motion"

export const PixelCorner = ({
  rotation = 0,
  className,
  dotClassName = "bg-white",
  size = 24,
  bottom = "auto",
  left = "auto",
  right = "auto",
  top = "auto",
}: {
  className?: string
  dotClassName?: string
  rotation?: number
  size?: number
  top?: number | "auto"
  bottom?: number | "auto"
  left?: number | "auto"
  right?: number | "auto"
}) => {
  return (
    <div
      className="absolute flex"
      style={{
        bottom,
        left,
        right,
        top,
      }}
    >
      <motion.div
        style={{ rotate: rotation }}
        initial={false}
        className="relative h-full w-full"
      >
        <motion.div
          className={clsx("", className)}
          style={{
            width: size,
            height: size,
          }}
        ></motion.div>
        <div
          className={clsx("absolute bottom-0 right-0 h-3 w-3", dotClassName)}
        ></div>
      </motion.div>
    </div>
  )
}

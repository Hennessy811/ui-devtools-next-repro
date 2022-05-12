import { ReactNode } from "react"

export const Tooltip = ({
  message,
  children,
}: {
  message: ReactNode
  children: ReactNode
}) => {
  return (
    <div className="group relative flex flex-col items-center">
      {children}
      <div className="absolute bottom-0 mb-6 hidden flex-col items-center group-hover:flex">
        <div className="whitespace-no-wrap relative z-10 rounded-md bg-gray-600 p-2 text-sm leading-none text-white shadow-lg">
          {message}
        </div>
        <div className="-mt-2 h-3 w-3 rotate-45 bg-gray-600"></div>
      </div>
    </div>
  )
}

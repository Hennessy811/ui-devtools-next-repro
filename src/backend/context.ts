import { PrismaClient } from "@prisma/client"
import * as trpc from "@trpc/server"
import * as trpcNext from "@trpc/server/adapters/next"
import { getSession } from "next-auth/react"

export interface Session {
  id: string
  image: string
  name: string
}

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
})

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  // this user is retrieved from the session callback, file: [...nextauth].ts
  const _user = (await getSession({ req }))?.user as Session

  let user
  if (_user) {
    user = await prisma.user.findUnique({
      where: { id: _user.id },
    })
  }

  return {
    req,
    res,
    prisma,
    user,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>

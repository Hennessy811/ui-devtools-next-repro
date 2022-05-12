import superjson from "superjson"

import createRouter from "@backend/createRouter"

import communitiesRouter from "./communities"
import questionsRouter from "./questions"
import usersRouter from "./users"

export const appRouter = createRouter()
  .transformer(superjson)

  .merge("questions.", questionsRouter)
  .merge("users.", usersRouter)
  .merge("communities.", communitiesRouter)

export type AppRouter = typeof appRouter

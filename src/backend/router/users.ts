import { z } from "zod"

import createRouter from "@backend/createRouter"

const usersRouter = createRouter()
  .query("me", {
    input: z
      .object({
        id: z.string().optional(),
      })
      .optional(),
    resolve: async ({ ctx }) => {
      return { name: "John Doe" }
    },
  })
  .mutation("checkTwitter", {
    input: z.object({
      username: z.string(),
      magicWord: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return { data: "ok" }
    },
  })

export default usersRouter

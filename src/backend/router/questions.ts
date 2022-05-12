import { Answer, Question, User } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { serialize } from "superjson"
import { z } from "zod"

import createRouter from "@backend/createRouter"

export type QuestionWithOwner = Question & { owner: User }
export type QuestionWithOwnerAnswers = Question & {
  owner: User
  answers: (Answer & { owner: User })[]
}

export type AnswerWithOwner = Answer & { owner: User }

const questionsRouter = createRouter()
  .mutation("recordView", {
    input: z.object({ id: z.string() }),
    resolve: async ({ ctx, input }) => {
      if (process.env.NODE_ENV !== "production") return
      const question = await ctx.prisma.question.findUnique({
        where: { id: input.id },
      })

      const viewCount = (question?.view_count || 0) + 1
      await ctx.prisma.question.update({
        where: { id: input.id },
        data: {
          view_count: viewCount,
        },
      })
      return []
    },
  })
  .query("list", {
    input: z.object({
      slug: z.string().optional(),
    }),
    resolve: async ({ ctx, input }) =>
      ctx.prisma.question
        .findMany({
          where: {
            communitySlug: input.slug,
          },
          include: { owner: true },
          orderBy: { createdAt: "desc" },
        })
        .then((r) => serialize(r).json as unknown as QuestionWithOwner[]),
  })
  .query("listAnswers", {
    input: z.object({
      questionId: z.string(),
    }),
    resolve: async ({ ctx, input }) =>
      ctx.prisma.answer
        .findMany({
          where: {
            questionId: input.questionId,
          },
          include: { owner: true },
        })
        .then((r) => serialize(r).json as unknown as AnswerWithOwner[]),
  })
  .mutation("create", {
    input: z.object({
      title: z.string(),
      content: z.string(),
      tags: z.array(z.string()),
      communitySlug: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const { user, prisma } = ctx
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })

      return prisma.question.create({
        data: {
          body: input.content,
          title: input.title,
          tags: input.tags,
          communitySlug: input.communitySlug,
          owner: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    },
  })
  .mutation("createAnswer", {
    input: z.object({
      content: z.string(),
      questionId: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const { user, prisma } = ctx
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })

      const question = await prisma.question.findUnique({
        where: {
          id: input.questionId,
        },
      })

      await prisma.question.update({
        where: { id: input.questionId },
        data: { answer_count: (question?.answer_count || 0) + 1 },
      })

      return prisma.answer.create({
        data: {
          content: input.content,
          question: {
            connect: { id: input.questionId },
          },

          owner: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    },
  })

export default questionsRouter

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"
import GoogleProvider from "next-auth/providers/google"
import TwitterProvider from "next-auth/providers/twitter"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"

import { prisma } from "@backend/context"

const handler = async (req, res) => {
  let providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!)
          if (siwe.domain !== nextAuthUrl.host) {
            return null
          }

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null
          }

          await siwe.validate(credentials?.signature || "")

          // @ts-ignore
          const _userId = credentials?.userId
          const userId: string | undefined =
            _userId === "undefined" ? undefined : _userId

          const userAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "ethereum",
                providerAccountId: siwe.address,
              },
            },
            include: { user: true },
          })

          const existingUser = await prisma.user.findUnique({
            where: {
              id: userId,
              walletAddress: userId ? undefined : siwe.address,
            },
            include: { accounts: true },
          })

          if (userAccount?.user && !existingUser) {
            console.log(
              "WARNING!!! Found an account with, but no user!",
              userAccount.user.id
            )
          }

          let user = existingUser || null

          // if user exists and wallet assigned, update wallet address
          if (user?.accounts?.find((a) => a.provider === "ethereum")) {
            console.log("--- Existing user found, updating wallet address ---")

            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                walletAddress: siwe.address,
              },
              include: { accounts: true },
            })
          }
          // user have account with OAuth, but no wallet connected, we need to create wallet account
          else if (existingUser) {
            console.log("--- Existing user found, creating wallet account ---")

            user = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                walletAddress: siwe.address,
                accounts: {
                  create: {
                    provider: "ethereum",
                    providerAccountId: siwe.address,
                    type: "cridentials",
                  },
                },
              },
              include: { accounts: true },
            })

            // else we need to create a new user
          } else {
            console.log("--- Creating new user ---")

            user = await prisma.user.create({
              data: {
                accounts: {
                  create: {
                    provider: "ethereum",
                    providerAccountId: siwe.address,
                    type: "cridentials",
                  },
                },
                walletAddress: siwe.address,
              },

              include: {
                accounts: true,
              },
            })
          }


          return {
            id: user?.id,
            walletAddress: siwe.address,
          }
        } catch (e) {
          return null
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),

    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),

    TwitterProvider({
      clientId: process.env.TWITTER_ID || "",
      clientSecret: process.env.TWITTER_SECRET || "",
      version: "2.0", // opt-in to Twitter OAuth 2.0
      // token
    }),
  ]

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin")

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) providers = []

  // @ts-ignore
  return await NextAuth(req, res, {
    adapter: PrismaAdapter(prisma),
    providers,
    session: {
      strategy: "jwt",
      secret: process.env.NEXT_AUTH_SECRET,
    },
    jwt: {
      secret: process.env.NEXT_AUTH_SECRET,
      maxAge: 60 * 60 * 24 * 30,
    },
    secret: process.env.NEXT_AUTH_SECRET,

    callbacks: {
      signIn: async (_user) => {
        console.log("SIGN IN ", _user)

        const { user, account } = _user

        return user
      },
      async session({ session, token }) {
        console.log("session", { session, token })

        // if user is signed in via wallet, its token.sub is account id (id of account with wallet)
        // but if user is signed in via OAuth, token.sub is user id

        if (!token.sub) return null

        // we need to get the user by its account id and provide real user data
        const account = await prisma.account.findUnique({
          where: {
            id: token.sub,
          },
          include: {
            user: true,
          },
        })

        const user = account?.user

        if (user) {
          console.log("User logged in via wallet", user.id)

          session.user.id = user.id
          return session
        }

        // if such user not found, it means that user is signed in via OAuth and we need to return his info
        if (!user) {
          console.log("User logged in via OAuth", token.sub)

          session.user.id = token.sub
          session.user.image =
            token.picture || "https://www.fillmurray.com/128/128"
          return session
        }
      },
    },
  })
}

export default handler

import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/router"

export const getAvatarUrl = (url?: string | null, name = "default") =>
  url || `https://avatars.dicebear.com/api/initials/${name}.svg`

export const isBrowser = () => typeof window !== "undefined"

export const numberFormat = (num: number | null) =>
  !num ? "???" : num.toLocaleString("en-US")

export const pluralize = (str: string, count: number | null) => {
  if (count === null) return "???"
  if (count === 1) return str
  return `${str}s`
}

export const formatDate = (date: string) =>
  (date
    ? formatDistanceToNow(new Date(date), { addSuffix: true })
    : "a moment ago") as unknown as Date

export const pages = {
  root: "/",
  profile: "/profile",
  communities: "/",
}

const pagesRouted = (query: Record<string, string>) => {
  const _community = query.slug || "any"

  return {
    root: "/",
    profile: "/profile",

    communities: "/",
    community: (id: string) => `/communities/${id}`,
    leaderboard: (community = _community) =>
      `/communities/${community}/leaderboard`,

    questions: () => `/communities/${_community}/questions`,
    question: (id: string) => `/communities/${_community}/questions/${id}`,
    createQuestion: () =>
      `/communities/${_community}/questions/create-question`,
  }
}

export const usePages = () => {
  const query = useRouter().query
  return pagesRouted(query as Record<string, string>)
}

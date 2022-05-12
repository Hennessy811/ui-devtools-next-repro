import { withSentry } from "@sentry/nextjs"
import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"

import { headers, NARCISSA_API } from "@shared/server/constants"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, page } = req.query
  const url = `${NARCISSA_API}/${slug}/leaderboard`

  if (!slug || slug === "<no source>") {
    return res.json({ data: [] })
  }

  const data = await axios.get(url, { headers, params: { page } })
  return res.json(data?.data?.data)
}

export default withSentry(handler)

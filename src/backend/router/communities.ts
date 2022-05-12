import axios from "axios"

import createRouter from "@backend/createRouter"
import { headers, NARCISSA_API } from "@shared/server/constants"

const communitiesRouter = createRouter().query("list", {
  resolve: async () => {
    const url = `${NARCISSA_API}/communities`
    const response = await axios({ url, headers })
    return response?.data?.data
  },
})

export default communitiesRouter

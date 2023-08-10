import { ApiResponse, withMethods } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default function Errors(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!withMethods(req, ['POST'])) return

    const { error, errorInfo } = req.body

    console.error(error)

    res.status(200).end()
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e.message || e))
  }
}

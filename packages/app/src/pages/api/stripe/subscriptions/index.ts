import { getProductPrices } from "lib/services/stripe/server";
import { ApiResponse } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const products = await getProductPrices()

    return res.status(200).json(ApiResponse(products))
  } catch (error) {
    console.error(error)
    return res.status(500).json(ApiResponse(error))
  }
}

import { withUser } from "lib/utils/server";
import { NextApiResponse } from "next";

export default async function Home(req, res: NextApiResponse) {
  try {
    const user = await withUser(req, res)

    if (!user)
      return res.redirect(301, '/')

    const { status, application_status } = user
    if (status !== 'active') {
      return res.redirect(301, '/register')
    }

    if (application_status === 'approved') {
      return res.redirect(301, '/member')
    } else {
      return res.redirect(301, '/apply/' + application_status)
    }
  } catch (error) {
    console.error(error)
    return res.redirect(301, '/')
  }

}

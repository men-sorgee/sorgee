import { User } from "lib/models";
import { updateUser } from "lib/services/directus/server/users";
import { withMethods, withUser } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function DeleteUser(
  req: NextApiRequest,
  res: NextApiResponse) {
  try {
    withMethods(req, ['GET'])
    const user = await withUser(req, res)
    const { cancelled: c } = req.query
    const cancelled = String(c) == 'true'
    if (user.membership_type != 'none' && !cancelled) {
      // user has a subscription, we need to cancel this first
      return res.redirect(`/api/stripe/subscriptions/cancel?callbackUrl=/api/me/delete?cancelled=true`)
    }

    await updateUser<User>(user.id, {
      status: 'inactive',
      notes: `${user?.notes}\nUser requested deactivation on ${new Date().toISOString()}`
    })

    return res.redirect(`/api/auth/signout?callbackUrl=/unauthorized?error=Your account has been deactivated.`)
  } catch (e) {
    console.error(e)
    return res.redirect(
      `/unauthorized?error=${encodeURI(e.message)}`
    )
  }
}

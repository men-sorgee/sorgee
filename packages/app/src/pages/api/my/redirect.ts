import { withUser } from "lib/utils/server";

export default async function Redirect(req, res) {
  try {
    const user = await withUser(req, res)

    const { application_status } = user
    if (application_status === 'approved') {
      return res.redirect('/member', 301)
    } else {
      return res.redirect('/apply/' + application_status, 301)
    }
  } catch (_) {
    return res.redirect('/api/auth/signin?callbackUrl=/api/my/redirect', 301)
  }

}

import { Member } from "lib/models";
import { findUser, updateUser } from "lib/services/directus/server/users";
import { ApiResponseType, withMethods } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function listUserInvites(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<boolean>>
) {
  try {
    withMethods(req, ['GET'])

    const { email: e, token: t } = req.query
    const email = String(e).toLowerCase()
    const token = String(t)
    const member = await findUser<Member>(email,
      ['id', 'email', 'email_new', 'email_token'])


    if (!member)
      throw new Error('Email address not found.')

    const { email_new } = member
    if (member.email_token != token)
      throw new Error('Email address does not belong to this user.')

    // permanently change the email address
    await updateUser(member.id, { email_new: null, email_token: null, email: email_new })

    return res.redirect(`/api/auth/signin?provider=email&email=${encodeURI(email_new)}&callbackUrl=/member/account`)
  } catch (e) {
    console.error(e)
    return res.redirect(`/unauthorized?error=${encodeURI(e.message)}`)
  }
}

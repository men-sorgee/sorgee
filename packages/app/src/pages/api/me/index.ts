import { Member, memberFields, User } from "lib/models";
import { getUser, updateUser } from "lib/services/directus/server/users";
import {
  ApiResponse,
  ApiResponseType,
  withMethods,
  withUser
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function CurrentMember(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<Member> | ApiResponseType>
) {
  try {
    const method = withMethods(req, ['GET', 'POST'])
    const me = await withUser(req, res)

    let fields = [
      ...memberFields,
      'buddies.buddy_id.id' as any,
      'likes.liked_id.id' as any]

    const user = await getUser<Member>(me.id, fields)

    if (method == 'POST') {
      const userDetails = req.body as Partial<User>
      const updated = await updateUser(me.id, userDetails)
      return res.status(200).json(ApiResponse(updated))
    }

    return res.status(200).json(ApiResponse(user || me))
  } catch (e) {
    console.error(e.message)
    res.status(401).json(ApiResponse(null, e.message || e))
  }
}


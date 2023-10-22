import { Member, memberFields, searchableMemberFields } from "lib/models";
import { getUser } from "lib/services/directus/server";
import { ApiResponse, ApiResponseType, withUser } from "lib/utils/server";

import type { NextApiRequest, NextApiResponse } from 'next';
export default async function GetUserBuddies(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType>
) {
  try {
    const user = await withUser(req, res)

    let fields = [
      ...memberFields,
      ...searchableMemberFields.map(f => `buddies.buddy_id.${f}` as any),]

    let me = await getUser<Member>(user.id, fields)
    let blocked = [
      ...me.blocked.map(blocked => blocked.blocked_id),
      ...me.blocked_by.map(blocked => blocked.user_id),
    ].filter(b => b)

    let buddies = me.buddies
      .map(b => b.buddy_id as unknown as Member)
      .filter(b => b.show_profile && b.status == 'active')
      .filter(b => !blocked.includes(b.id))

    return res.status(200).json(ApiResponse(buddies))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse([]))
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}

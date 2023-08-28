import { ConversationStats, MemberLevel, UserMessageStats } from "lib/models";
import { getMessages, getUser } from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withMember,
  withMethods
} from "lib/utils/server";

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function UserMessages(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<UserMessageStats> | ApiResponseType>
) {

  try {
    const method = withMethods(req, ['GET'])
    const me = await withMember(req, res)

    const { id: i } = req.query
    let id = String(i)

    const them = await getUser(id)

    // only show stats when a brother is looking at a pledge
    if (MemberLevel[me.user_type] >= MemberLevel.brother && (MemberLevel[them.user_type] == MemberLevel.pledge ||
      MemberLevel[me.user_type] == MemberLevel.staff)) {

      const messages = await getMessages(id)
      const messageStats: UserMessageStats = {
        conversations: [] as ConversationStats[]
      }

      Object.keys(messages).forEach(key => {
        let convo = messages[key];

        messageStats.conversations.push({
          id: key,
          name: convo[0].user.nickname,
          picture: convo[0].user.picture,
          messageCount: convo.length
        } as ConversationStats)
      })

      return res.status(200).json(ApiResponse(messageStats))
    }
    return res.status(200).json(ApiResponse({
      conversations: []
    }))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}

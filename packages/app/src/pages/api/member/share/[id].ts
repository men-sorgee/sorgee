import { baseUrl } from 'lib/config'
import { ApiResponse, UserShare } from 'lib/models'
import {
  addUserNotification,
  createUserShare,
  deleteUserShare,
  getMember,
} from 'lib/services/directus/server'
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail,
} from 'lib/services/sendgrid/server'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ShareWithMember(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserShare> | ApiResponse>
) {
  try {
    const method = withMethods(req, ['POST', 'DELETE'])
    const me = await withMember(req, res)

    const { id } = req.query
    const user_id = String(id)

    const them = await getMember(user_id)

    const sharedWith = me.photo_shares as UserShare[]
    let existingShare = sharedWith?.find((s) => s.viewer_id == user_id)
    if (method == 'DELETE') {
      if (existingShare) {
        await deleteUserShare(me.id, user_id)
        return res.status(200).json(ApiResponse({}))
      } else {
        return res.status(200).json(ApiResponse({}))
      }
    } else if (method == 'POST' && existingShare == null) {
      await createUserShare(me.id, user_id)

      let myName = me.nickname || me.first_name

      // send notification
      await addUserNotification({
        user_id: them.id,
        message: `${myName} shared their private photos!`,
        button_text: 'View Photos',
        button_url: `/members/${me.id}`,
      })

      await sendNotificationEmail(
        them.email,
        them.first_name,
        `${myName} has shared their private photos with you!`,
        'Congratulations! You have been granted access to view private photos from a member of the community. Click the button below to view their photos.',
        {
          button_text: 'View Photos',
          button_url: `${baseUrl}/members/${me.id}`,
          user_id: them.id,
        },
        SendGridTemplate.AppNotification,
        SendGridCategory.Notification
      )

      return res.status(200).json(ApiResponse(existingShare))
    }
    return res.status(200).end()
  } catch (e) {
    console.error(e)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}

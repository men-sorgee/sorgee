import { NextApiRequest, NextApiResponse } from 'next'
import { withMethods, withMember } from 'lib/utils/server'
import { ApiResponse, UserShare } from 'lib/models'
import { getMember, deleteUserShare, createUserShare, addUserNotification } from 'lib/services/directus/server'
import { baseUrl } from 'lib/config'
import { sendNotificationEmail, SendGridCategory, SendGridTemplate } from 'lib/services/sendgrid/server'

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

    const sharedWith = (me.photo_shares as UserShare[])
    let existingShare = sharedWith?.find(s => s.viewer_id == user_id)
    if (method == 'DELETE') {
      if (existingShare) {
        await deleteUserShare(existingShare.id)
        return res.status(200).json(ApiResponse({}))
      } else {
        return res.status(200).json(ApiResponse({}))
      }
    } else if (method == 'POST' && existingShare == null) {

      await createUserShare(me.id, user_id)

      // send notification
      await addUserNotification({
        user_id: them.id,
        message: `${me.nickname} shared their private photos!`,
        button_text: 'View Photos',
        button_url: `/member/${me.id}`
      })

      await sendNotificationEmail(
        them.email,
        them.first_name,
        `${me.nickname} has shared their private photos with you!`,
        'Congratulations! You have been granted access to view private photos from a member of the community. Click the button below to view their photos.',
        {
          button_text: 'View Photos',
          button_url: `${baseUrl}/members/${me.id}`,
          user_id: them.id
        },
        SendGridTemplate.AppNotification,
        SendGridCategory.Notification
      )

      return res.status(200).json(ApiResponse(existingShare))
    }
    return res.status(200).end()
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}

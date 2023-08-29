import { EventDetail, EventUser, Member } from "lib/models";
import {
  addAlert,
  addNotificationUser,
  createEventSurvey,
  createEventSurveyNotification,
  getEventDetail,
  setUserAverageRating,
  updateEvent,
  updateEventUsers,
  updateSurvey
} from "lib/services/directus/server";
import {
  ApiResponse,
  ApiResponseType,
  withMethods,
  withStaff
} from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Event(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<EventDetail | EventUser[]>>
) {
  try {
    withMethods(req, ['GET'])
    await withStaff(req, res)
    const { id: i, expenses: e } = req.query
    const id = String(i)
    const expenses = e ? Number(e) : 0

    const event = await getEventDetail(id)
    if (!event) throw new Error('Event not found')

    await updateEvent(id, {
      status: 'occurred',
      expenses
    })

    // create event survey
    const survey = await createEventSurvey(event)
    // create event survey notification
    const notification = await createEventSurveyNotification(survey.id, event)

    await updateSurvey(survey.id, {
      notification: notification.id
    })

    let attendees = event.attendance
      .filter(a => a.attended).map((a: EventUser) => a.users_id as Partial<Member>)
      .map((m: Partial<Member>) => m.id)

    await Promise.all(attendees.map(u => addNotificationUser(notification.id, u)))


    let noShows = (event.attendance.filter(a => a.rsvp == 'confirmed' && a.attended == null) as EventUser[])

    const noShowInviteIds = noShows.map((n: EventUser) => n.id)
    const nowShowUserIds = noShows.map((n: EventUser) => n.users_id as Partial<Member>).map((m: Partial<Member>) => m.id)

    await updateEventUsers(noShowInviteIds, {
      attended: false,
    })

    const ratings = await Promise.all(nowShowUserIds.map((i) => setUserAverageRating(i)))

    await Promise.all(nowShowUserIds.map((u, i) => {
      let rating = ratings[i]
      let message = (rating < 5) ? `Your rating was adjusted to ${rating}` : 'Your rating did not change.'
      addAlert(u, {
        message: `You were marked as a no-show for ${event.name}. ` + message,
        button_text: 'View Event',
        button_url: `/events/${event.id}`,
        icon: 'warning'
      })
    }))

    return res.status(200).json(ApiResponse(event))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}



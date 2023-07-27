import { ApiResponse, EventDetail, EventUser, Member, MemberLevel } from 'lib/models'
import { addAppNotificationUser, addUserNotification, createEventSurvey, createEventSurveyNotification, getEventDetail, setUserAverageRating, updateEvent, updateEventUsers, updateSurvey } from 'lib/services/directus/server'
import { withMember, withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Event(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<EventDetail | EventUser[]>>
) {
  try {
    const method = withMethods(req, ['GET'])
    const user = await withMember(req, res)
    const { id: i } = req.query
    const id = String(i)

    const event = await getEventDetail(id)
    if (!event) throw new Error('Event not found')

    await updateEvent(id, {
      status: 'occurred',
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

    await Promise.all(attendees.map(u => addAppNotificationUser(notification.id, u)))


    let noShows = (event.attendance.filter(a => a.rsvp == 'confirmed' && a.attended != true) as EventUser[])

    const ids = noShows.map((n: EventUser) => n.id)
    const userIds = noShows.map((n: EventUser) => n.users_id as Partial<Member>).map((m: Partial<Member>) => m.id)

    await updateEventUsers(ids, {
      attended: false,
    })

    const ratings = await Promise.all(userIds.map((i) => setUserAverageRating(i)))

    await Promise.all(userIds.map((u, i) => addUserNotification(u, {
      message: `You were marked as a no-show for ${event.name}. Your rating decreased to ${ratings[i].toFixed(2)}.` +
        `Brothers with less than three stars can9not confirm events without pre-paying.`,
    })))

    return res.status(200).json(ApiResponse(event))
  } catch (e) {
    if (e.message == 'Unauthorized') return res.status(200).json(ApiResponse(null))
    console.error(e)
    return res.status(401).json(ApiResponse(null, e))
  }
}



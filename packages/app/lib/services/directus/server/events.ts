import { getAdminClient } from '.'
import { EventDetail } from '../../../models'

export async function listUpcomingEvents(): Promise<EventDetail[]> {
  const client = await getAdminClient()
  const { data } = await client.items('events').readByQuery({
    filter: {
      status: { _eq: 'scheduled' },
    },
    fields: ['*.*'],
  })
  return data as EventDetail[]
}

export async function listEvents() {
  const client = await getAdminClient()
  const { data } = await client.items('events').readByQuery({
    filter: {
      status: { _in: ['scheduled', 'occurred'] },
    },
    fields: ['*.*'],
    sort: ['-datetime'],
  })
  return data as EventDetail[]
}

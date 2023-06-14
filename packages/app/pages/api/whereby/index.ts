import { storeRoomEvent } from '@/lib/services/directus/server/rooms'

export default async function wherebyWebhook(req, res) {
  const { id, type, data, createdAt } = req.body
  const { meetingId, roomName } = data

  await storeRoomEvent({
    id,
    meetingId,
    room: roomName,
    type,
    payload: data,
    created_at: createdAt,
  })
  switch (type) {
    case 'room.session.started': {
    }
    case 'room.session.ended': {
    }
    case 'room.client.joined': {
      const { numClients, numClientsByRoleName } = data

      return res.status(201).json()
    }
    case 'room.client.left': {
      const { numClients, numClientsByRoleName } = data
    }
  }

  return res.status(200).json({ message: 'OK' })
}

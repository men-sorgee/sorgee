import { Room, RoomEvent } from "lib/models";

import { getAdminClient } from "./";

const mainRoom = 'fad1af2e-67fc-49a7-afdd-f00f12c7968e'

export async function createRoom(room: Partial<Room>) {
  const admin = await getAdminClient()
  const newRoom = await client.items('room').createItem(room)
  return newRoom
}

export async function getRoom(id: string = mainRoom) {
  const admin = await getAdminClient()
  const room = await client.items('room').readItem(id)
  return room
}

export async function updateRoom(id: string = mainRoom, room: Partial<Room>) {
  const admin = await getAdminClient()
  const updatedRoom = await client.items('room').updateItem(id, room)
  return updatedRoom
}

export async function storeRoomEvent(roomEvent: RoomEvent) {
  const admin = await getAdminClient()
  const newRoomEvent = await client.items('room_event').createItem(roomEvent)
  return newRoomEvent
}

import * as typeorm from "typeorm";

import { Room } from "./Room";

@typeorm.Index('room_events_pkey', ['id'], { unique: true })
@typeorm.Entity('room_events', { schema: 'public' })
export class RoomEvents {
  @typeorm.Column('character varying', { primary: true, name: 'id', length: 255 })
  id: string

  @typeorm.Column('json', { name: 'payload', nullable: true })
  payload: object | null

  @typeorm.Column('timestamp without time zone', { name: 'created_at', nullable: true })
  createdAt: Date | null

  @typeorm.Column('character varying', { name: 'type', nullable: true, length: 255 })
  type: string | null

  @typeorm.ManyToOne(() => Room, (room) => room.roomEvents, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn([{ name: 'room', referencedColumnName: 'id' }])
  room: typeorm.Relation<Room>
}

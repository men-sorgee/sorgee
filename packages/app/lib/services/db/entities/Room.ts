import * as typeorm from 'typeorm'
import { RoomEvents } from './RoomEvents'

@typeorm.Index('room_pkey', ['id'], { unique: true })
@typeorm.Entity('room', { schema: 'public' })
export class Room {
  @typeorm.PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @typeorm.Column('character varying', {
    name: 'status',
    length: 255,
    default: () => "'draft'",
  })
  status: string

  @typeorm.Column('integer', { name: 'sort', nullable: true })
  sort: number | null

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('character varying', { name: 'name', nullable: true, length: 255 })
  name: string | null

  @typeorm.Column('character varying', { name: 'url', nullable: true, length: 255 })
  url: string | null

  @typeorm.Column('integer', { name: 'user_count', nullable: true })
  userCount: number | null

  @typeorm.Column('json', { name: 'metadata', nullable: true })
  metadata: object | null

  @typeorm.OneToMany(() => RoomEvents, (roomEvents) => roomEvents.room)
  roomEvents: typeorm.Relation<RoomEvents[]>
}

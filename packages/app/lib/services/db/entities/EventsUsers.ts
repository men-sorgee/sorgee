import * as typeorm from 'typeorm'
import { Events } from './Events'
import { User } from './Users'

@typeorm.Index('events_users_pkey', ['id'], { unique: true })
@typeorm.Entity('events_users', { schema: 'public' })
export class EventsUsers {
  @typeorm.PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @typeorm.Column('json', { name: 'engagement', nullable: true })
  engagement: object | null

  @typeorm.Column('boolean', { name: 'attended', nullable: true })
  attended: boolean | null

  @typeorm.Column('json', { name: 'flags', nullable: true })
  flags: object | null

  @typeorm.Column('character varying', {
    name: 'rsvp',
    nullable: true,
    length: 255,
    default: () => "'invited'",
  })
  rsvp: string | null

  @typeorm.Column('boolean', { name: 'paid', nullable: true, default: () => 'false' })
  paid: boolean | null

  @typeorm.Column('boolean', { name: 'guest', nullable: true, default: () => 'false' })
  guest: boolean | null

  @typeorm.Column('character varying', { name: 'reason', nullable: true, length: 255 })
  reason: string | null

  @typeorm.ManyToOne(() => Events, (events) => events.eventsUsers, {
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn([{ name: 'events_id', referencedColumnName: 'id' }])
  events: typeorm.Relation<Events>

  @typeorm.ManyToOne(() => User, (users) => users.eventsUsers, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  users: typeorm.Relation<User>
}

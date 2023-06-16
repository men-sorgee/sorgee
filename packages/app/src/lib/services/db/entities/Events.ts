import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DirectusUsers } from './DirectusUsers'
import { EventsUser } from './EventsUsers'
import { Location } from './Location'
import { Notifications } from './Notifications'
import { Rating } from './Rating'
import { Surveys } from './Surveys'

@Index('events_pkey', ['id'], { unique: true })
@Entity('events', { schema: 'public' })
export class Events {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @Column('character varying', {
    name: 'status',
    length: 255,
    default: () => "'draft'",
  })
  status: string

  @Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @Column('timestamp without time zone', { name: 'datetime' })
  datetime: Date

  @Column('character varying', { name: 'name', nullable: true, length: 255 })
  name: string | null

  @Column('text', { name: 'description', nullable: true })
  description: string | null

  @Column('numeric', {
    name: 'cost',
    nullable: true,
    precision: 10,
    scale: 0,
    default: () => "'30'",
  })
  cost: string | null

  @Column('boolean', { name: 'invite_only', default: () => 'true' })
  inviteOnly: boolean

  @Column('character varying', {
    name: 'type',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  type: string | null

  @Column('json', { name: 'visibility', nullable: true, default: [] })
  visibility: object | null

  @Column('timestamp without time zone', { name: 'datetime_end' })
  datetimeEnd: Date

  @ManyToOne(() => Notifications, (notifications) => notifications.events, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'confirmation', referencedColumnName: 'id' }])
  confirmation: Notifications

  @ManyToOne(() => Location, (location) => location.events, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'location', referencedColumnName: 'id' }])
  location: Location

  @JoinColumn([{ name: 'notification', referencedColumnName: 'id' }])
  notification: Notifications

  @JoinColumn([{ name: 'user_created', referencedColumnName: 'id' }])
  userCreated: DirectusUsers

  @JoinColumn([{ name: 'user_updated', referencedColumnName: 'id' }])
  userUpdated: DirectusUsers

  @OneToMany(() => EventsUser, (eventsUsers) => eventsUsers.events)
  eventsUsers: EventsUser[]

  @OneToMany(() => Rating, (rating) => rating.event)
  ratings: Rating[]

  @OneToMany(() => Surveys, (surveys) => surveys.event)
  surveys: Surveys[]
}

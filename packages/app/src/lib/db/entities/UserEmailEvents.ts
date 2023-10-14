import * as typeorm from "typeorm";

@typeorm.Index('user_email_events_pkey', ['id'], { unique: true })
@typeorm.Entity('user_email_events', { schema: 'public' })
export class UserEmailEvents {
  @typeorm.PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  date_created: Date | null

  @typeorm.Column('json', { name: 'payload', nullable: true })
  payload: object | null

  @typeorm.Column('character varying', { name: 'event', nullable: true, length: 2550 })
  event: string | null

  @typeorm.Column('character varying', {
    name: 'marketing_campaign_name',
    nullable: true,
    length: 2550,
  })
  marketing_campaign_name: string | null

  @typeorm.Column('character varying', {
    name: 'marketing_campaign_id',
    nullable: true,
    length: 2550,
    default: () => 'NULL::character varying',
  })
  marketing_campaign_id: string | null

  @typeorm.Column('character varying', { name: 'email', nullable: true, length: 2550 })
  email: string | null

  @typeorm.Column('character varying', {
    name: 'category',
    nullable: true,
    length: 2550,
    default: () => 'NULL::character varying',
  })
  category: string | null

  @typeorm.Column('character varying', {
    name: 'sg_event_id',
    nullable: true,
    length: 2550,
    default: () => 'NULL::character varying',
  })
  sg_event_id: string | null

  @typeorm.Column('character varying', {
    name: 'sg_message_id',
    nullable: true,
    length: 2550,
    default: () => 'NULL::character varying',
  })
  sg_message_id: string | null

  @typeorm.Column('integer', { name: 'timestamp', nullable: true })
  timestamp: number | null

  @typeorm.Column('character varying', {
    name: 'response',
    nullable: true,
    length: 2550,
    default: () => 'NULL::character varying',
  })
  response: string | null

  @typeorm.Column('character varying', {
    name: 'url',
    nullable: true,
    length: 2550,
    default: () => 'NULL::character varying',
  })
  url: string | null

  @typeorm.Column('character varying', {
    name: 'type',
    nullable: true,
    length: 2550,
    default: () => 'NULL::character varying',
  })
  type: string | null

  @typeorm.Column('character varying', { name: 'status', nullable: true, length: 2550 })
  status: string | null

  @typeorm.Column('integer', { name: 'notification_id', nullable: true })
  notification_id: number | null

  // @typeorm.ManyToOne(() => User, (users) => users.userEmailEvents, {
  //   onDelete: 'SET NULL',
  // })
  // @typeorm.JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  // user: typeorm.Relation<User>

  @typeorm.Column('character varying', {
    name: 'user',
    nullable: true,
    length: 2550,
    default: () => 'NULL::character varying',
  })
  user: string | null
}

import { Events, NotificationsUsers, Survey } from "lib/db/entities";
import * as typeorm from "typeorm";

@typeorm.Index('notifications_pkey', ['id'], { unique: true })
@typeorm.Entity('notifications', { schema: 'public' })
export class Notifications {
  @typeorm.PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @typeorm.Column('character varying', {
    name: 'status',
    length: 255,
    default: () => "'draft'",
  })
  status: string

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('character varying', {
    name: 'link',
    nullable: true,
    length: 255,
    default: () => "'/member/profile'",
  })
  link: string | null

  @typeorm.Column('character varying', { name: 'subject', nullable: true, length: 255 })
  subject: string | null

  @typeorm.Column('boolean', { name: 'send_email', default: () => 'false' })
  sendEmail: boolean

  @typeorm.Column('character varying', {
    name: 'button_text',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  buttonText: string | null

  @typeorm.Column('character varying', {
    name: 'template',
    length: 255,
    default: () => "'d-7fe0a94b7c0b40b2a68b5d998ee6f7af'",
  })
  template: string

  @typeorm.Column('boolean', { name: 'static', nullable: true })
  static: boolean | null

  @typeorm.Column('json', { name: 'data', nullable: true, default: {} })
  data: object | null

  @typeorm.Column('character varying', {
    name: 'category',
    length: 255,
    default: () => "'notification'",
  })
  category: string

  @typeorm.Column('character varying', {
    name: 'button_url',
    nullable: true,
    length: 255,
    default: () => "'https://guysnheat.com/members'",
  })
  buttonUrl: string | null

  @typeorm.Column('text', { name: 'body', nullable: true })
  body: string | null

  @typeorm.Column('text', { name: 'message', nullable: true })
  message: string | null

  @typeorm.Column('boolean', {
    name: 'app_notification',
    nullable: true,
    default: () => 'true',
  })
  notification: boolean | null

  @typeorm.Column('integer', { name: 'sort', nullable: true, default: () => '0' })
  sort: number | null

  @typeorm.Column('character varying', { name: 'name', nullable: true, length: 255 })
  name: string | null

  @typeorm.Column('json', { name: 'visibility', nullable: true })
  visibility: object | null

  @typeorm.OneToMany(() => Events, (events) => events.confirmation)
  events: Events[]

  @typeorm.JoinTable()
  @typeorm.OneToMany(
    () => NotificationsUsers,
    (notificationsUsers) => notificationsUsers.notification
  )
  notificationsUsers: typeorm.Relation<NotificationsUsers[]>

  @typeorm.OneToMany(() => Survey, (surveys) => surveys.notification)
  surveys: Survey[]
}

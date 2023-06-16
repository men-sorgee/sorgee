import * as typeorm from 'typeorm'

import { Notifications } from './Notifications'
import { User } from './User'

@typeorm.Index('notifications_users_pkey', ['id'], { unique: true })
@typeorm.Entity('notifications_users', { schema: 'public' })
export class NotificationsUsers {
  @typeorm.PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @typeorm.Column('character varying', {
    name: 'status',
    nullable: true,
    length: 255,
    default: () => "'new'",
  })
  status: string | null

  @typeorm.ManyToOne(() => Notifications, (notifications) => notifications.notificationsUsers, {
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn([{ name: 'notification_id', referencedColumnName: 'id' }])
  notification: typeorm.Relation<Notifications>

  @typeorm.ManyToOne(() => User, (users) => users.notificationsUsers, {
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: typeorm.Relation<User>
}

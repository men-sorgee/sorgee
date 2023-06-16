import * as typeorm from 'typeorm'

import { DirectusUsers } from './DirectusUsers'
import { User } from './User'

@typeorm.Index('user_buddy_pkey', ['id'], { unique: true })
@typeorm.Entity('user_buddy', { schema: 'public' })
export class UserBuddy {
  @typeorm.Column('uuid', { primary: true, name: 'id' })
  id: string

  @typeorm.JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: typeorm.Relation<User>

  @typeorm.ManyToOne(() => User, (users) => users.buddy_of, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn([{ name: 'buddy_id', referencedColumnName: 'id' }])
  buddy: typeorm.Relation<User>

  @typeorm.Column('integer', { name: 'sort', nullable: true })
  sort: number | null

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.JoinColumn([{ name: 'user_created', referencedColumnName: 'id' }])
  userCreated: DirectusUsers

  @typeorm.JoinColumn([{ name: 'user_updated', referencedColumnName: 'id' }])
  userUpdated: DirectusUsers
}

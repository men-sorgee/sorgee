import * as typeorm from "typeorm";

import { DirectusUsers } from "./DirectusUsers";
import { User } from "./User";

@typeorm.Index('user_contact_attempt_pkey', ['id'], { unique: true })
@typeorm.Entity('user_contact_attempt', { schema: 'public' })
export class UserContactAttempt {
  @typeorm.Column('uuid', { primary: true, name: 'id' })
  id: string

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('character varying', {
    name: 'contact_method',
    nullable: true,
    length: 255,
  })
  contactMethod: string | null

  @typeorm.Column('text', { name: 'notes', nullable: true })
  notes: string | null

  @typeorm.ManyToOne(() => User, (users) => users.userContactAttempts, {
    onDelete: 'SET NULL',
  })
  @typeorm.JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user: typeorm.Relation<User>

  @typeorm.JoinColumn([{ name: 'user_created', referencedColumnName: 'id' }])
  userCreated: typeorm.Relation<DirectusUsers>
}

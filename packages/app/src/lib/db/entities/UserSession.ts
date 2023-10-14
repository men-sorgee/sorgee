import { User } from "lib/db/entities";
import * as typeorm from "typeorm";

@typeorm.Index('user_session_pkey', ['id'], { unique: true })
@typeorm.Entity('user_session', { schema: 'public' })
export class UserSession {
  @typeorm.PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @typeorm.Column('character varying', {
    name: 'session_token',
    nullable: true,
    length: 255,
  })
  sessionToken: string | null

  @typeorm.Column('timestamp with time zone', { name: 'expires', nullable: true })
  expires: Date | null

  @typeorm.ManyToOne(() => User, (user) => user.userSessions, {
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user: typeorm.Relation<User>
}

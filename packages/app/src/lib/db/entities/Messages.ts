import { DirectusFile, DirectusUsers, User } from "lib/db/entities";
import * as typeorm from "typeorm";

@typeorm.Index('messages_pkey', ['id'], { unique: true })
@typeorm.Entity('messages', { schema: 'public' })
export class Messages {
  @typeorm.PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @typeorm.Column('character varying', {
    name: 'status',
    nullable: true,
    length: 255,
    default: () => "'new'",
  })
  status: string | null

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('timestamp without time zone', { name: 'expires', nullable: true })
  expires: Date | null

  @typeorm.Column('text', { name: 'body', nullable: true })
  body: string | null

  @typeorm.Column('boolean', { name: 'edited', nullable: true, default: () => 'false' })
  edited: boolean | null

  @typeorm.Column('character varying', {
    name: 'type',
    nullable: true,
    length: 255,
    default: () => "'text'",
  })
  type: string | null

  @typeorm.ManyToOne(() => User, (users) => users.messages, { onDelete: 'CASCADE' })
  @typeorm.JoinColumn([{ name: 'from', referencedColumnName: 'id' }])
  from: typeorm.Relation<User>

  @typeorm.JoinColumn([{ name: 'image', referencedColumnName: 'id' }])
  image: typeorm.Relation<DirectusFile>

  @typeorm.JoinColumn([{ name: 'to', referencedColumnName: 'id' }])
  to: typeorm.Relation<User>

  @typeorm.JoinColumn([{ name: 'user_created', referencedColumnName: 'id' }])
  userCreated: typeorm.Relation<DirectusUsers>

  @typeorm.JoinColumn([{ name: 'user_updated', referencedColumnName: 'id' }])
  userUpdated: typeorm.Relation<DirectusUsers>
}

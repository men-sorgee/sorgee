import { DirectusUsers, User } from "lib/services/db/entities";
import * as typeorm from "typeorm";

@typeorm.Index('promos_code_unique', ['code'], { unique: true })
@typeorm.Index('promos_pkey', ['id'], { unique: true })
@typeorm.Entity('promos', { schema: 'public' })
export class Promos {
  @typeorm.PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('character varying', { name: 'code', unique: true, length: 255 })
  code: string

  @typeorm.Column('date', { name: 'expires', nullable: true })
  expires: string | null

  @typeorm.Column('json', { name: 'override', nullable: true })
  override: object | null

  @typeorm.Column('text', { name: 'description', nullable: true })
  description: string | null

  @typeorm.Column('character varying', { name: 'name', nullable: true, length: 255 })
  name: string | null

  @typeorm.JoinColumn([{ name: 'user_created', referencedColumnName: 'id' }])
  userCreated: typeorm.Relation<DirectusUsers>

  @typeorm.JoinColumn([{ name: 'user_updated', referencedColumnName: 'id' }])
  userUpdated: typeorm.Relation<DirectusUsers>

  @typeorm.ManyToOne(() => User, (users) => users.promos, { onDelete: 'SET NULL' })
  @typeorm.JoinColumn([{ name: 'vouching_user', referencedColumnName: 'id' }])
  vouchingUser: typeorm.Relation<User>

  @typeorm.OneToMany(() => User, (users) => users.promo)
  users: typeorm.Relation<User[]>
}

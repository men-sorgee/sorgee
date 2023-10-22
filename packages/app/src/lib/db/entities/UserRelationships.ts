import { User } from "lib/db/entities";
import * as typeorm from "typeorm";

@typeorm.Index('user_relationships_pkey', ['id'], { unique: true })
@typeorm.Entity('user_relationships', { schema: 'public' })
export class UserRelationships {
  @typeorm.PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @typeorm.Column('character varying', {
    name: 'relation',
    length: 255,
    default: () => "'buddy'",
  })
  relation: string

  @typeorm.Column('json', { name: 'affects', nullable: true })
  affects: object | null

  @typeorm.Column('integer', { name: 'sort', nullable: true })
  sort: number | null

  @typeorm.ManyToOne(() => User, (users) => users.userRelationships, {
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn([{ name: 'related_users_id', referencedColumnName: 'id' }])
  relatedUsers: typeorm.Relation<User>

  @typeorm.ManyToOne(() => User, (users) => users.userRelationships, {
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  users: typeorm.Relation<User>
}

import * as typeorm from 'typeorm'
import { Events } from './Events'
import { User } from './User'

@typeorm.Index('rating_pkey', ['id'], { unique: true })
@typeorm.Entity('rating', { schema: 'public' })
export class Rating {
  @typeorm.PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('integer', { name: 'rate', nullable: true, default: () => '0' })
  rate: number | null

  @typeorm.Column('character varying', {
    name: 'collection',
    nullable: true,
    length: 255,
    default: () => "'events'",
  })
  collection: string | null

  @typeorm.JoinColumn([{ name: 'event', referencedColumnName: 'id' }])
  event: typeorm.Relation<Events>

  @typeorm.JoinColumn([{ name: 'member', referencedColumnName: 'id' }])
  member: typeorm.Relation<User>

  @typeorm.JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user: typeorm.Relation<User>
}

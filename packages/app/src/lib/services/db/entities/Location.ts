import * as typeorm from "typeorm";

import { DirectusFile } from "./DirectusFiles";
import { Events } from "./Events";
import { Surveys } from "./Surveys";
import { User } from "./User";

@typeorm.Index('location_pkey', ['id'], { unique: true })
@typeorm.Entity('location', { schema: 'public' })
export class Location {
  @typeorm.PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('character varying', { name: 'name', nullable: true, length: 255 })
  name: string | null

  @typeorm.Column('character varying', { name: 'street', nullable: true, length: 255 })
  street: string | null

  @typeorm.Column('character varying', { name: 'unit', nullable: true, length: 255 })
  unit: string | null

  @typeorm.Column('character varying', { name: 'city', nullable: true, length: 255 })
  city: string | null

  @typeorm.Column('character varying', { name: 'state', nullable: true, length: 255 })
  state: string | null

  @typeorm.Column('character varying', { name: 'zip', nullable: true, length: 255 })
  zip: string | null

  @typeorm.Column('text', { name: 'notes', nullable: true })
  notes: string | null

  @typeorm.Column('integer', {
    name: 'display_threshold',
    nullable: true,
    default: () => '2',
  })
  displayThreshold: number | null

  @typeorm.OneToMany(() => Events, (events) => events.location)
  events: Events[]

  @typeorm.JoinColumn([{ name: 'logo', referencedColumnName: 'id' }])
  logo: typeorm.Relation<DirectusFile>

  @typeorm.ManyToOne(() => User, (users) => users.locations, { onDelete: 'SET NULL' })
  @typeorm.JoinColumn([{ name: 'owner', referencedColumnName: 'id' }])
  owner: typeorm.Relation<User>

  @typeorm.OneToMany(() => Surveys, (surveys) => surveys.location)
  surveys: typeorm.Relation<Surveys[]>
}

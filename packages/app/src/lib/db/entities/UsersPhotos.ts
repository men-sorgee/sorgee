import { DirectusFile, User } from "lib/db/entities";
import * as typeorm from "typeorm";

@typeorm.Index('users_photos_pkey', ['id'], { unique: true })
@typeorm.Entity('users_photos', { schema: 'public' })
export class UsersPhotos {
  @typeorm.PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @typeorm.Column('integer', { name: 'sort', nullable: true })
  sort: number | null

  @typeorm.Column('boolean', {
    name: 'is_public',
    nullable: true,
    default: () => 'false',
  })
  isPublic: boolean | null

  @typeorm.Column('character varying', {
    name: 'status',
    nullable: true,
    length: 255,
    default: () => "'new'",
  })
  status: string | null

  @typeorm.JoinColumn([{ name: 'directus_files_id', referencedColumnName: 'id' }])
  directusFile: typeorm.Relation<DirectusFile>

  @typeorm.JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  user: typeorm.Relation<User>
}

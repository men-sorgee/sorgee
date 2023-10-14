import { DirectusFile, User } from "lib/db/entities";
import * as typeorm from "typeorm";

@typeorm.Index('users_files_pkey', ['id'], { unique: true })
@typeorm.Entity('users_files', { schema: 'public' })
export class UsersFiles {
  @typeorm.PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @typeorm.Column('boolean', { name: 'public', nullable: true })
  public: boolean | null

  @typeorm.JoinColumn([{ name: 'directus_files_id', referencedColumnName: 'id' }])
  directusFiles: typeorm.Relation<DirectusFile>

  @typeorm.JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  user: typeorm.Relation<User>
}

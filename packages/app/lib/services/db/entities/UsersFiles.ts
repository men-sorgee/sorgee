import * as typeorm from 'typeorm'
import { DirectusFiles } from './DirectusFiles'
import { User } from './Users'

@typeorm.Index('users_files_pkey', ['id'], { unique: true })
@typeorm.Entity('users_files', { schema: 'public' })
export class UsersFiles {
  @typeorm.PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @typeorm.Column('boolean', { name: 'public', nullable: true })
  public: boolean | null

  @typeorm.ManyToOne(() => DirectusFiles, (directusFiles) => directusFiles.usersFiles, {
    onDelete: 'SET NULL',
  })
  @typeorm.JoinColumn([{ name: 'directus_files_id', referencedColumnName: 'id' }])
  directusFiles: typeorm.Relation<DirectusFiles>

  @typeorm.ManyToOne(() => User, (users) => users.usersFiles, { onDelete: 'SET NULL' })
  @typeorm.JoinColumn([{ name: 'users_id', referencedColumnName: 'id' }])
  users: typeorm.Relation<User>
}

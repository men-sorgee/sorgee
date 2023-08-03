import * as typeorm from "typeorm";

import { User } from "./User";

@typeorm.Index('user_account_pkey', ['id'], { unique: true })
@typeorm.Entity('user_account', { schema: 'public' })
export class UserAccount {
  @typeorm.PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @typeorm.Column('character varying', {
    name: 'provider_id',
    nullable: false,
    length: 255,
  })
  providerId: string | null

  @typeorm.Column('character varying', {
    name: 'provider',
    nullable: false,
    length: 255,
  })
  provider: string | null

  @typeorm.Column('character varying', { name: 'type', nullable: false, length: 255 })
  type: string | null

  @typeorm.Column('integer', { name: 'expires_at', nullable: true })
  expiresAt: number | null

  @typeorm.Column('character varying', {
    name: 'token_type',
    nullable: true,
    length: 255,
  })
  tokenType: string | null

  @typeorm.Column('character varying', {
    name: 'scope',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  scope: string | null

  @typeorm.Column('character varying', {
    name: 'session_state',
    nullable: true,
    length: 255,
  })
  sessionState: string | null

  @typeorm.Column('character varying', {
    name: 'oath_token_secret',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  oathTokenSecret: string | null

  @typeorm.Column('text', { name: 'id_token', nullable: true })
  idToken: string | null

  @typeorm.Column('text', { name: 'access_token', nullable: true })
  accessToken: string | null

  @typeorm.Column('text', { name: 'refresh_token', nullable: true })
  refreshToken: string | null

  @typeorm.Column('text', { name: 'oauth_token', nullable: true })
  oauthToken: string | null

  @typeorm.ManyToOne(() => User, (user) => user.userAccounts, {
    onDelete: 'CASCADE',
  })
  @typeorm.JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user: typeorm.Relation<User | Partial<User>>
}

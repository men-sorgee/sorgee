import {
  Column,
  Entity,
  Index,
} from 'typeorm'

@Index('directus_users_email_unique', ['email'], { unique: true })
@Index('directus_users_external_identifier_unique', ['externalIdentifier'], {
  unique: true,
})
@Index('directus_users_pkey', ['id'], { unique: true })
@Index('directus_users_token_unique', ['token'], { unique: true })
@Entity('directus_users', { schema: 'public' })
export class DirectusUsers {
  @Column('uuid', { primary: true, name: 'id' })
  id: string

  @Column('character varying', {
    name: 'first_name',
    nullable: true,
    length: 50,
  })
  firstName: string | null

  @Column('character varying', {
    name: 'last_name',
    nullable: true,
    length: 50,
  })
  lastName: string | null

  @Column('character varying', {
    name: 'email',
    nullable: true,
    unique: true,
    length: 128,
  })
  email: string | null

  @Column('character varying', {
    name: 'password',
    nullable: true,
    length: 255,
  })
  password: string | null

  @Column('character varying', {
    name: 'location',
    nullable: true,
    length: 255,
  })
  location: string | null

  @Column('character varying', { name: 'title', nullable: true, length: 50 })
  title: string | null

  @Column('text', { name: 'description', nullable: true })
  description: string | null

  @Column('json', { name: 'tags', nullable: true })
  tags: object | null

  @Column('uuid', { name: 'avatar', nullable: true })
  avatar: string | null

  @Column('character varying', {
    name: 'language',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  language: string | null

  @Column('character varying', {
    name: 'theme',
    nullable: true,
    length: 20,
    default: () => "'auto'",
  })
  theme: string | null

  @Column('character varying', {
    name: 'tfa_secret',
    nullable: true,
    length: 255,
  })
  tfaSecret: string | null

  @Column('character varying', {
    name: 'status',
    length: 16,
    default: () => "'active'",
  })
  status: string

  @Column('character varying', {
    name: 'token',
    nullable: true,
    unique: true,
    length: 255,
  })
  token: string | null

  @Column('timestamp with time zone', { name: 'last_access', nullable: true })
  lastAccess: Date | null

  @Column('character varying', {
    name: 'last_page',
    nullable: true,
    length: 255,
  })
  lastPage: string | null

  @Column('character varying', {
    name: 'provider',
    length: 128,
    default: () => "'default'",
  })
  provider: string

  @Column('character varying', {
    name: 'external_identifier',
    nullable: true,
    unique: true,
    length: 255,
  })
  externalIdentifier: string | null

  @Column('json', { name: 'auth_data', nullable: true })
  authData: object | null

  @Column('boolean', {
    name: 'email_notifications',
    nullable: true,
    default: () => 'true',
  })
  emailNotifications: boolean | null
}

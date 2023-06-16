import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Index('user_verification_token_pkey', ['id'], { unique: true })
@Index('user_verification_token_token_unique', ['token'], { unique: true })
@Entity('user_verification_token', { schema: 'public' })
export class UserVerificationToken {
  @Column('character varying', {
    name: 'email',
    length: 255,
    default: () => 'NULL::character varying',
  })
  email: string

  @Column('timestamp without time zone', { name: 'expires', nullable: true })
  expires: Date | null

  @Column('character varying', {
    name: 'token',
    unique: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  token: string

  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number
}

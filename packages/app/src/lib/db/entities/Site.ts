import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index('site_pkey', ['id'], { unique: true })
@Entity('site', { schema: 'public' })
export class Site {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @Column('character varying', {
    name: 'site_title',
    nullable: true,
    length: 255,
  })
  siteTitle: string | null

  @Column('boolean', {
    name: 'invite_only',
    nullable: true,
    default: () => 'false',
  })
  inviteOnly: boolean | null

  @Column('text', { name: 'description', nullable: true })
  description: string | null
}

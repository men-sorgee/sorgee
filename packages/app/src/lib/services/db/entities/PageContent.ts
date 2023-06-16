import * as typeorm from 'typeorm'

import { DirectusFile } from './DirectusFiles'
import { DirectusUsers } from './DirectusUsers'
import { Page } from './Page'

@typeorm.Index('page_content_pkey', ['id'], { unique: true })
@typeorm.Entity('page_content', { schema: 'public' })
export class PageContent {
  @typeorm.Column('uuid', { primary: true, name: 'id' })
  id: string

  @typeorm.Column('character varying', {
    name: 'status',
    length: 255,
    default: () => "'draft'",
  })
  status: string

  @typeorm.Column('integer', { name: 'sort', nullable: true })
  sort: number | null

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('character varying', { name: 'name', nullable: true, length: 255 })
  name: string | null

  @typeorm.Column('text', { name: 'html', nullable: true })
  html: string | null

  @typeorm.Column('text', { name: 'markdown', nullable: true })
  markdown: string | null

  @typeorm.Column('json', { name: 'control', nullable: true })
  control: object | null

  @typeorm.Column('character varying', { name: 'type', nullable: true, length: 255 })
  type: string | null

  @typeorm.Column('character varying', {
    name: 'container_classes',
    nullable: true,
    length: 255,
  })
  containerClasses: string | null

  @typeorm.Column('integer', { name: 'columns', nullable: true, default: () => '1' })
  columns: number | null

  @typeorm.JoinColumn([{ name: 'image', referencedColumnName: 'id' }])
  image: typeorm.Relation<DirectusFile>

  @typeorm.ManyToOne(() => Page, (page) => page.pageContents, { onDelete: 'SET NULL' })
  @typeorm.JoinColumn([{ name: 'page', referencedColumnName: 'id' }])
  page: typeorm.Relation<Page>

  @typeorm.JoinColumn([{ name: 'user_created', referencedColumnName: 'id' }])
  userCreated: typeorm.Relation<DirectusUsers>

  @typeorm.JoinColumn([{ name: 'user_updated', referencedColumnName: 'id' }])
  userUpdated: typeorm.Relation<DirectusUsers>
}

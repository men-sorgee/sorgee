import {
  DirectusFile,
  DirectusUsers,
  PageContent
} from "lib/services/db/entities";
import * as typeorm from "typeorm";

@typeorm.Tree('nested-set')
@typeorm.Index('page_pkey', ['id'], { unique: true })
@typeorm.Index('page_slug_unique', ['slug'], { unique: true })
@typeorm.Entity('page', { schema: 'public' })
export class Page {
  @typeorm.Column('uuid', { primary: true, name: 'id' })
  id: string

  @typeorm.Column('character varying', {
    name: 'status',
    length: 255,
    default: () => "'draft'",
  })
  status: string

  @typeorm.Column('timestamp with time zone', { name: 'date_created', nullable: true })
  dateCreated: Date | null

  @typeorm.Column('timestamp with time zone', { name: 'date_updated', nullable: true })
  dateUpdated: Date | null

  @typeorm.Column('character varying', { name: 'title', nullable: true, length: 255 })
  title: string | null

  @typeorm.Column('text', { name: 'description', nullable: true })
  description: string | null

  @typeorm.Column('character varying', {
    name: 'slug',
    nullable: true,
    unique: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  slug: string | null

  @typeorm.Column('boolean', {
    name: 'in_menu',
    nullable: true,
    default: () => 'false',
  })
  inMenu: boolean | null

  @typeorm.Column('integer', { name: 'sort', default: () => '1' })
  sort: number

  @typeorm.Column('text', { name: 'markdown', nullable: true })
  markdown: string | null

  @typeorm.Column('boolean', { name: 'static', nullable: true, default: () => 'false' })
  static: boolean | null

  @typeorm.Column('json', { name: 'visibility', nullable: true, default: [] })
  visibility: string[] | null

  @typeorm.Column('boolean', {
    name: 'editable_content',
    nullable: true,
    default: () => 'false',
  })
  editableContent: boolean | null

  @typeorm.Column('date', { name: 'published', nullable: true })
  published: string | null

  @typeorm.Column('boolean', {
    name: 'blog_article',
    nullable: true,
    default: () => 'false',
  })
  blogArticle: boolean | null

  @typeorm.JoinColumn([{ name: 'image', referencedColumnName: 'id' }])
  image: typeorm.Relation<DirectusFile>

  @typeorm.ManyToOne(() => Page, (page) => page.nextPage)
  @typeorm.JoinColumn([{ name: 'next_page', referencedColumnName: 'id' }])
  nextPage: Page

  @typeorm.Column('character varying', {
    name: 'next_page_params',
    nullable: true,
    length: 255,
  })
  nextPageParams: string | null

  @typeorm.TreeParent()
  parent: Page

  @typeorm.TreeChildren()
  children: Page[]

  @typeorm.JoinColumn([{ name: 'user_created', referencedColumnName: 'id' }])
  userCreated: typeorm.Relation<DirectusUsers>

  @typeorm.JoinColumn([{ name: 'user_updated', referencedColumnName: 'id' }])
  userUpdated: typeorm.Relation<DirectusUsers>

  @typeorm.OneToMany(() => PageContent, (pageContent) => pageContent.page)
  pageContents: typeorm.Relation<PageContent[]>
}

import { Block } from 'editorjs-blocks-react-renderer'
import { DirectusFile, DirectusUser } from './directus'
import { User } from './users'

export type File = {
  filepath: string
  newFilename: string
  originalFilename: string
  mimetype: string
}

export type MetaProps = {
  title: string
  description?: string
  basePath?: string
  url?: string
  image?: string
}

export enum ContentStatusType {
  Published = 'published',
  Draft = 'draft',
}
export type ContentType = 'html' | 'md' | 'image' | 'control'

export type PageItem = {
  title: string
  path: string
  children: PageItem[]
}

export type Page = {
  id: string
  status: string
  user_created?: string
  date_created?: string
  user_updated?: string
  date_updated?: string
  title?: string
  description?: string
  slug?: string
  in_menu?: boolean
  image?: DirectusFile
  sort: number
  parent?: Partial<Page>
  children?: Partial<Page>[]
  markdown?: string
  content: PageContent[]
  next_page?: Page
  next_page_params?: string
}

export type Promo = {
  id: number
  name: string
  description: string
  user_created?: string | DirectusUser
  date_created?: string
  user_updated?: string | DirectusUser
  date_updated?: string
  code: string
  expires?: string
  override?: {
    site?: Partial<Site>
  }
  vouching_user?: string | User
}

export type Promos = {
  id: number
  user_created?: string | DirectusUser
  date_created?: string
  user_updated?: string | DirectusUser
  date_updated?: string
  code: string
  expires?: string
  override?: unknown
  vouching_user?: string | User
  description?: string
  name?: string
}

export type PageContent = {
  id: string
  status: string
  sort?: number
  name?: string
  html?: string
  markdown?: string
  control?: { time: number; blocks: Block[]; version: string }
  image?: DirectusFile
  type?: string
  page?: Page
  columns: number
  container?: string
  container_classes?: string
}

export type Site = {
  id?: number
  site_title?: string
  invite_only?: boolean
  description?: string
}

export * from './directus'

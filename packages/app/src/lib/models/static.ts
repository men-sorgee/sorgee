import { Block } from "editorjs-blocks-react-renderer";
import {
  DirectusField,
  DirectusFile,
  DirectusUser,
  UserType,
  VouchingUser
} from "lib/models";

export type FieldMap = Record<string, DirectusField>

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
  isChild?: boolean
  visibility?: UserType[]
}

export type Page = {
  id: string
  title?: string
  description?: string
  slug: string
  in_menu: boolean
  blog_article: boolean
  static: Boolean
  image?: DirectusFile
  sort: number
  visibility: UserType[]
  parent?: Page
  children?: Page[]
  markdown?: string
  content: PageContent[]
  next_page?: Page
  next_page_params?: string
  status: 'published' | 'draft'
  published: string
  user_created?: string
  date_created?: string
  user_updated?: string
  date_updated?: string
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
  vouching_user?: string | VouchingUser
}

export type PageContent = {
  id: string
  status: 'published' | 'draft'
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
  announcement?: string
}

export type Announcement = {
  id: string;
  status: string;
  message?: string;
  type?: string;
  show_from?: string;
  show_until?: string;
};

export type FieldOptions = DirectusField['meta']['options'][]

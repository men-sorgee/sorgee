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
export * from './directus'

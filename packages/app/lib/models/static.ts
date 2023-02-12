export type File = {
  filepath: string
  newFilename: string
  originalFilename: string
  mimetype: string
}

export type ApiResponse<T = (object & never) | any> = {
  error?: {
    field: string & keyof T
    message: string
  }
  data?: T
}

export function ApiResponse<T = any | any>(
  data: T,
  error?: string,
  field?: string & keyof T
): ApiResponse<T> {
  return {
    data,
    error: error ? { message: error, field } : undefined,
  }
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

export type PageProps<T> = Record<keyof T, string | string[]> & {
  page: number
  size: number
  sort: string
}

export * from './billing'
export * from './directus'
export * from './events'
export * from './files'
export * from './location'
export * from './messages'
export * from './notifications'
export * from './static'
export * from './surveys'
export * from './users'

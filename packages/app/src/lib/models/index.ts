

export type PageProps<T> = Record<keyof Omit<Partial<T>, 'id'>, string[]> & {
  page: number
  size: number
  sort: string
}


export * from './billing'
export * from './events'
export * from './users'
export * from './static'
export * from './directus'
export * from './messages'
export * from './surveys'
export * from './notifications'

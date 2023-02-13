import { Directus } from '@directus/sdk'
import { DirectusField, DirectusTypes, Promo, User } from 'lib/models'

const adminDb = new Directus<DirectusTypes>(process.env.ADMIN_URL)

export async function getAdminClient(): Promise<Directus<DirectusTypes>> {
  if (await adminDb.auth.token) return adminDb
  await adminDb.auth.static(process.env.ADMIN_TOKEN)
  return adminDb
}

export async function findPromo(code: string): Promise<Promo | null> {
  const adminClient = await getAdminClient()
  const { data } = await adminClient.items('promos').readByQuery({
    filter: {
      code: { _eq: code },
    },
  })
  console.dir(data)
  return data?.length ? (data[0] as Promo) : null
}
const cache: { [key: string]: any } = {}

export async function getFields(collection: string = 'users'): Promise<DirectusField[]> {
  const key = `${collection}}`
  if (cache[key]) {
    return cache[key]
  }
  const adminClient = await getAdminClient()
  const { data } = await adminClient.fields.readMany(collection)
  if (!data) return []
  data.forEach((field: DirectusField) => {
    field.options = field.meta?.options?.choices || []
    cache[`${collection}:${field.field}`] = field
  })
  return (cache[key] = data as DirectusField[])
}

export async function getField<T = User>(field: keyof T, collection: string = 'users') {
  const key = `${collection}:${String(field)}`
  if (cache[key]) {
    return cache[key]
  }
  const adminClient = await getAdminClient()
  const response: DirectusField = await adminClient.fields.readOne(collection, String(field))
  if (!response) return null
  response.options = response?.meta?.options?.choices || []
  return response ? (cache[key] = response) : null
}

export async function getFieldOptions<T = User>(fieldName: keyof T, collection: string = 'users') {
  const field: DirectusField = await getField<T>(fieldName, collection)
  if (!field) return []
  return field.options
}

export * from './events'
export * from './files'
export * from './users'
export * from './surveys'

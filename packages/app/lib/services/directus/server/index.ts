import { Directus } from '@directus/sdk'
import { DirectusTypes, Promo, User } from 'lib/models'

const adminDb = new Directus<DirectusTypes>(process.env.ADMIN_URL)

export async function getAdminClient(): Promise<Directus<DirectusTypes>> {
  if (await adminDb.auth.token) return adminDb
  await adminDb.auth.static(process.env.ADMIN_TOKEN)
  return adminDb
}

export async function findPromo(promo: string): Promise<Promo | null> {
  const adminClient = await getAdminClient()
  const { data } = await adminClient.items('promos').readByQuery({
    filter: {
      code: { _eq: promo },
    },
  })
  return data?.length ? (data[0] as Promo) : null
}

const cache: { [key: string]: any } = {}
export async function getFieldOptions<T = User>(field: keyof T, collection: string = 'users') {
  const key = `${collection}:${String(field)}`
  if (cache[key]) {
    return cache[key]
  }
  const adminClient = await getAdminClient()
  const response: any = await adminClient.fields.readOne(collection, String(field))

  return response ? (cache[key] = response!.meta!.options.choices) : []
}

export * from './files'
export * from './users'

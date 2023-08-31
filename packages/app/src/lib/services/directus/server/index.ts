import { adminUrl } from "lib/config";
import {
  DirectusField,
  DirectusTypes,
  FieldMap,
  Promo,
  Promos,
  User
} from "lib/models";

import {
  authentication,
  createDirectus,
  DirectusClient,
  graphql,
  readItem,
  readItems,
  realtime,
  rest
} from "@directus/sdk";

import { Promos } from "../../db/entities";

const _adminDb = createDirectus<DirectusTypes>(adminUrl)
  .with(rest({

  }))
  .with(graphql)
  .with(authentication("json", {
    autoRefresh: true
  }))
  .with(realtime({

  }))
const cache: { [key: string]: any } = {}

export async function getAdminClient() {
  if (await _adminDb.getToken()) return _adminDb
  _adminDb.setToken(process.env.ADMIN_TOKEN)
  return _adminDb
}

export async function findPromo(code: string): Promise<Promo | null> {
  const adminClient = await getAdminClient()
  const data = await adminClient.request<Promos[]>(readItems('promos', {
    filter: {
      code: { _eq: code },
    },
  })
  return data?.length ? (data[0] as Promo) : null
}

export async function getFields(collection: string = 'users'): Promise<FieldMap> {
  const key = `${collection}-fields`
  if (cache[key]) {
    return cache[key]
  }
  const adminClient = await getAdminClient()
  const { data } = await adminClient..readMany(collection)
  if (!data) return {}

  const fieldMap = data.reduce((acc: any, field: DirectusField): any => {
    field.options = field.meta?.options?.choices || []
    delete field.translations
    delete field.note
    delete field.collection
    delete field.special
    delete field.group
    delete field.conditions
    delete field.validation

    cache[`${collection}:${field.field}`] = field
    acc[field.field] = field
    return acc
  }, {} as Record<string, DirectusField>)

  return (cache[key] = fieldMap)
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

export * from './alerts';
export * from './events';
export * from './files';
export * from './messages';
export * from './notifications';
export * from './surveys';
export * from './users';


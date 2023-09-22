import { User } from "next-auth";

import { DirectusField, readItem, readItems } from "@directus/sdk";

import { FieldMap } from "../../../models";
import { getAdminClient } from "./";

export async function getFields(collection: string = 'users'): Promise<FieldMap> {

  const admin = getAdminClient()
  const data = await admin.request(readItems('directus_fields', {
    filter: {
      collection: { _eq: collection },
    }
  }))
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


    acc[field.field] = field
    return acc
  }, {} as Record<string, DirectusField>)

  return fieldMap
}

export async function getField<T = User>(field: keyof T, collection: string = 'users') {
  const key = `${collection}:${String(field)}`

  const admin = getAdminClient()
  const response = await admin.request<DirectusField>(readItem('directus_fields', String(field)))
  if (!response) return null
  response.options = response?.meta?.options?.choices || []
  return response
}

export async function getFieldOptions<T = User>(fieldName: keyof T, collection: string = 'users') {
  const field: DirectusField = await getField<T>(fieldName, collection)
  if (!field) return []
  return field.options
}

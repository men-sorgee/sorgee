import { DirectusField, FieldMap } from "lib/models";
import { User } from "next-auth";
import { readField, readFieldsByCollection } from "@directus/sdk";
import { getAdminClient } from "./";

export async function getFields(collection: string = 'users'): Promise<FieldMap> {
  const admin = getAdminClient()
  const data = await admin.request<DirectusField[]>(readFieldsByCollection(collection))

  const fieldMap = data?.reduce((acc: any, field: DirectusField) => {
    field.options = field.meta?.options?.choices || field.meta?.options || []
    delete field.meta

    acc[field.field] = field
    return acc
  }, {} as Record<string, DirectusField>)

  return fieldMap
}

export async function getField<T = User>(field: keyof T, collection: string = 'users') {
  const admin = getAdminClient()
  const response = await admin.request<DirectusField>(readField(collection, field as string))
  if (!response) return null
  response.options = response?.meta?.options?.choices || []
  return response
}

export async function getFieldOptions<T = User>(fieldName: keyof T, collection: string = 'users') {
  const field: DirectusField = await getField<T>(fieldName, collection)
  if (!field) return []
  return field.options
}

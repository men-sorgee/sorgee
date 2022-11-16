import { getAdminClient, cache } from "./client";

export async function getFieldOptions(
  field: string,
  collection: string = "users"
) {
  const adminClient = await getAdminClient();

  const key = `${collection}:${field}`;
  if (cache[key]) {
    return cache[key];
  }

  const positionResponse: any = await adminClient.fields.readOne(
    collection,
    field
  );

  return positionResponse
    ? (cache[key] = positionResponse!.meta!.options.choices)
    : [];
}

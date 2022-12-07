import { User } from './types';
import { NextApiRequest, NextApiResponse } from 'next';
import { adminBaseUrl, getAdminClient } from './client';

const cache: { [key: string]: any } = {};

export async function getFieldOptions<T = User>(
  field: keyof T,
  collection: string = 'users'
) {
  const adminClient = await getAdminClient();

  const key = `${collection}:${String(field)}`;
  if (cache[key]) {
    return cache[key];
  }

  const response: any = await adminClient.fields.readOne(
    collection,
    String(field)
  );

  return response ? (cache[key] = response!.meta!.options.choices) : [];
}

export async function getAsset(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  const url = `${adminBaseUrl}/assets/${id}?fit=cover&access_token=${process.env.ADMIN_TOKEN}`;

  const response = await fetch(url);
  return res.status(response.status).send(response.body);
}

export * from './models/events';
export * from './models/files';
export * from './models/users';

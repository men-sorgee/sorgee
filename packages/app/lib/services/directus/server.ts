import { Applicant, applicantFields, Member, memberFields } from '.';

import { User } from './types';
import FormData from 'form-data';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseForm } from '../forms';
import { adminBaseUrl, getAdminClient } from './client';
const cache: { [key: string]: any } = {};
export enum UploadFolder {
  members = '8c3d5472-6b02-4056-affd-ab3d461b273d',
  profiles = '1ea29489-e282-4a1f-a981-8d578b6a1667',
  verification = '19610a61-14b2-4470-8952-e4d3502294cd'
}

export type File = {
  filepath: string;
  newFilename: string;
  originalFilename: string;
  mimetype: string;
};

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

export async function createUser(member: Partial<User>): Promise<any> {
  const adminClient = await getAdminClient();
  return adminClient.items('users').createOne(member, {
    fields: Object.keys(member)
  });
}

export async function updateUser(
  id: string,
  member: Partial<User>
): Promise<User | null> {
  const adminClient = await getAdminClient();
  return adminClient.items('users').updateOne(id!, member, {
    fields: Object.keys(member)
  });
}

export async function recordUserLogin(id: string) {
  const adminClient = await getAdminClient();
  return await adminClient.items('users').updateOne(id, {
    last_login: new Date().toISOString()
  });
}

export async function getApplicant(id: string): Promise<Applicant | null> {
  const adminClient = await getAdminClient();
  const member: Applicant = await adminClient
    .items('users')
    .readOne(id, { fields: [...applicantFields] });
  return member || null;
}

export async function getMember(id: string): Promise<Member | null> {
  const adminClient = await getAdminClient();
  const member: Member = await adminClient
    .items('users')
    .readOne(id, { fields: [...memberFields] });
  return member || null;
}

export async function getUser(id: string): Promise<User | null> {
  const adminClient = await getAdminClient();
  const user: any = await adminClient.items('users').readOne(id);
  return user || null;
}

export async function findUser<T = Applicant>(
  email: string,
  fields = applicantFields
): Promise<T | null> {
  const adminClient = await getAdminClient();
  const existingUserQuery = await adminClient.items('users').readByQuery({
    filter: { email },
    fields: [...(fields as any)]
  });

  return existingUserQuery?.data ? existingUserQuery.data[0] : null;
}

export async function uploadFile(
  req: NextApiRequest,
  folder: UploadFolder,
  title: string
) {
  const adminClient = await getAdminClient();
  const { fileInfo, fileData } = await parseForm(req);
  const { mimetype, originalFilename, filepath } = fileInfo;
  const formData = new FormData();
  formData.append('folder', folder);
  formData.append('title', title);
  formData.append('filename', originalFilename);
  formData.append('mimetype', mimetype);
  formData.append('file', fileData, {
    filename: originalFilename,
    filepath
  });
  const file = adminClient.files.createOne(
    formData,
    {},
    {
      requestOptions: {
        headers: {
          ...formData.getHeaders()
        }
      }
    }
  );
  return file;
}

export async function importFile(
  url: string,
  folder: UploadFolder,
  title: string
) {
  const adminClient = await getAdminClient();

  const file = adminClient.files.import({
    url,
    data: {
      folder,
      title
    }
  });
  return file;
}

export async function getAsset(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  const url = `${adminBaseUrl}/assets/${id}?fit=cover&access_token=${process.env.ADMIN_TOKEN}`;

  const response = await fetch(url);
  return res.status(response.status).send(response.body);
}

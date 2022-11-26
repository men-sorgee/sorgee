import { Member, memberFields } from '.'
import { Directus  } from "@directus/sdk";
import { Collections } from "./types";
import FormData from 'form-data';
import { NextApiRequest } from 'next'
import { parseForm } from '../forms'

const cache: { [key: string]: any } = {};

export enum UploadFolder {
  verification = '19610a61-14b2-4470-8952-e4d3502294cd'
}

export type File = {
  filepath: string;
  newFilename: string
  originalFilename: string
  mimetype: string;
}

const adminDb = new Directus<Collections>("https://admin.guysnheat.com");

export async function getAdminClient(): Promise<Directus<Collections>> {
  if (await adminDb.auth.token) return adminDb;
  const token = process.env.ADMIN_TOKEN as string;
  await adminDb.auth.static(token);
  return adminDb;
}

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

export async function createMember(member: Partial<Member>): Promise<any> {
  const adminClient = await getAdminClient();
  return adminClient.items("users").createOne(member, {
    fields: Object.keys(member),
  });
}

export async function updateMember(id: string, member: Partial<Member>): Promise<Member|null> {
  const adminClient = await getAdminClient();
  return adminClient.items("users").updateOne(id!, member, {
    fields: Object.keys(member),
  })
}

export async function recordMemberLogin(id: string) {
  const adminClient = await getAdminClient();
  return  await adminClient.items("users").updateOne(id, {
    last_login: new Date().toISOString(),
  });
}

export async function getMember(id: string) : Promise<Member|null> {
  const adminClient = await getAdminClient();
  const member: Member = await adminClient.items("users")
    .readOne(id, { fields: [...(memberFields as any)] })
  return member || null;
}

export async function findMember(email: string) : Promise<Member|null> {
  const adminClient = await getAdminClient();
  const existingUserQuery = await adminClient.items("users").readByQuery({
        filter: { email },
        fields: [...(memberFields as any)],
      });

  return existingUserQuery?.data
    ? existingUserQuery.data[0]
    : null;
}

export async function uploadFile(
  req: NextApiRequest,
  folder: UploadFolder, 
  title: string) {
  const adminClient = await getAdminClient();

  const { fileInfo, fileData } = await parseForm(req)
  const { mimetype, originalFilename, filepath } = fileInfo
 
  const formData = new FormData();
  formData.append('folder', folder);
  formData.append('title', title);
  formData.append('filename', originalFilename);
  formData.append('mimetype', mimetype)
  formData.append("file", fileData,  {
    filename: originalFilename,
    filepath
  });

  const file = adminClient.files.createOne(formData, {}, {
    requestOptions: {
      headers: {
        ...formData.getHeaders()
      }
    }
  })

  

  return file
}
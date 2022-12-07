import { NextApiRequest } from 'next';
import { parseForm } from '../../forms';
import { getAdminClient } from '../client';
import FormData from 'form-data';

export enum UploadFolder {
  members = '8c3d5472-6b02-4056-affd-ab3d461b273d',
  profiles = '1ea29489-e282-4a1f-a981-8d578b6a1667',
  verification = '19610a61-14b2-4470-8952-e4d3502294cd'
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

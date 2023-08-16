import FormData from "form-data";
import formidable, { Fields, File, Files } from "formidable";
import IncomingForm from "formidable/Formidable";
import { DirectusFile, DirectusFolder } from "lib/models";
import { NextApiRequest } from "next";
import { Writable } from "node:stream";

import { getAdminClient } from "./";

export enum UploadFolder {
  members = '8c3d5472-6b02-4056-affd-ab3d461b273d',
  profiles = '1ea29489-e282-4a1f-a981-8d578b6a1667',
  verification = '19610a61-14b2-4470-8952-e4d3502294cd',
}

export enum FolderType {
  private = 'private',
  public = 'public',
}

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false,
}

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: Fields; files: Files; form: IncomingForm }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts)

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      return accept({ fields, files, form })
    })
  })
}

const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk)
      next()
    },
  })

  return writable
}

export type FileInfo = {
  mimetype: string
  originalFilename: string
  filepath: string
  data: Buffer
}

export async function getFileInfo(req: NextApiRequest): Promise<FileInfo & { form: IncomingForm }> {
  const chunks: never[] = []
  try {
    const { files, form } = await formidablePromise(req, {
      ...formidableConfig,
      fileWriteStreamHandler: () => fileConsumer(chunks),
    })

    const media = files.media as File
    //const fileInfo: File = files as File
    const data = Buffer.concat(chunks)
    const { mimetype, originalFilename, filepath } = media
    return { mimetype, originalFilename, filepath, data, form }
  } catch (er) {
    console.error(er)
    return null
  }
}

async function decodeBase64Image(dataString: string) {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/m)

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid input string')
  }

  const type = matches[1]
  const extension = type.split('/')[1]
  //const blob = await (await fetch(dataString)).blob()
  const data = Buffer.from(matches[2], 'base64') // base64toBytes(matches[2])
  const size = data.length
  return {
    extension,
    type,
    data,
    size,
    //blob,
  }
}

// Service Calls ------------------------------------
export async function createFolder(newFolder: {
  name: string
  id?: string
  parent?: string
}): Promise<DirectusFolder> {
  const adminClient = await getAdminClient()
  const folder = await adminClient.folders.createOne(newFolder)
  return folder
}

export async function findFolder(name: string, parent?: string): Promise<DirectusFolder> {
  const adminClient = await getAdminClient()
  const filter = {
    name: { _eq: name },
  }
  if (parent) {
    filter['parent'] = { _eq: parent }
  }
  const folders = await adminClient.folders.readByQuery({
    filter,
  })
  if (folders.data.length === 0) return null
  return folders.data[0] as DirectusFolder
}

export async function uploadFile(
  fileInfo: FileInfo,
  folder: UploadFolder | string,
  title: string,
  description?: string
) {
  const adminClient = await getAdminClient()
  const { mimetype: type, originalFilename: name, filepath: path, data } = fileInfo
  const formData = new FormData()
  formData.append('folder', folder)
  formData.append('title', title)
  formData.append('filename', name || 'photo')
  formData.append('description', description)
  formData.append('mimetype', type)
  formData.append('file', data, {
    ...fileInfo,
    filename: name || 'photo',
    filepath: path,
    contentType: type,
  })
  const file = await adminClient.files.createOne(
    formData,
    {
    },
    {
      requestOptions: {
        headers: {
          ...formData.getHeaders(),
        },
      },
    }
  )
  return file
}

export async function uploadBase64Image(image: string, folder: UploadFolder, title: string) {
  const { type, data, extension } = await decodeBase64Image(image)
  const adminClient = await getAdminClient()
  // const { type, name } = blob
  const formData = new FormData()
  formData.append('folder', folder)
  formData.append('title', title)
  formData.append('filename', title + '.' + extension)
  formData.append('mimetype', type)
  formData.append('file', data, {
    filename: title + '.' + extension,
    filepath: '',
    contentType: type,
    knownLength: data.length,
  })
  const file = adminClient.files.createOne(
    formData,
    {},
    {
      requestOptions: {
        headers: {
          ...formData.getHeaders(),
        },
      },
    }
  )
  return file
}

export async function importFile(
  url: string,
  folder: UploadFolder,
  title: string
): Promise<DirectusFile> {
  const adminClient = await getAdminClient()

  const file = await adminClient.files.import({
    url,
    data: {
      folder,
      title,
    },
  })
  return file as DirectusFile
}

export async function deleteFile(id: string) {
  const adminClient = await getAdminClient()
  await adminClient.files.deleteOne(id)
}

export async function getFile(id: string) {
  const adminClient = await getAdminClient()
  const file = await adminClient.files.readOne(id)
  if (!file) return null
  return file as unknown as DirectusFile
}

export async function updateFile(id: string, fileInfo: DirectusFile) {
  const adminClient = await getAdminClient()
  await adminClient.files.updateOne(id, fileInfo as any)
}

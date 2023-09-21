
import formidable, { Fields, File, Files } from "formidable";
import IncomingForm from "formidable/Formidable";
import {
  DirectusFile,
  DirectusFolder,
  FileInfo,
  UploadFolder
} from "lib/models";
import { NextApiRequest } from "next";
import { Writable } from "node:stream";

import {
  createFolder as createDirectusFolder,
  deleteFile as deleteDirectusFile,
  importFile as importDirectusFile,
  readFile,
  readFolders,
  updateFile as updateDirectusFile,
  uploadFiles
} from "@directus/sdk";

import { getAdminClient } from "./";

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

export async function getFileInfo(req: NextApiRequest): Promise<FileInfo & { form: IncomingForm }> {
  const chunks: never[] = []
  try {
    const { files, form } = await formidablePromise(req, {
      ...formidableConfig,
      fileWriteStreamHandler: () => fileConsumer(chunks),
    })

    const media = files.media[0] as File
    //const fileInfo: File = files as File
    const data = Buffer.concat(chunks)
    const { mimetype, originalFilename, filepath } = media
    return { mimetype, originalFilename, filepath, data, form }
  } catch (er) {
    console.error(er)
    return null
  }
}


export async function createFolder(newFolder: {
  name: string
  id?: string
  parent?: string
}): Promise<DirectusFolder> {
  const admin = await getAdminClient()
  const folder = await admin.request(createDirectusFolder(newFolder))
  return folder
}

export async function findFolder(name: string, parent?: string): Promise<DirectusFolder> {
  const admin = await getAdminClient()
  const filter = {
    name: { _eq: name },
  }
  if (parent) {
    filter['parent'] = { _eq: parent }
  }
  const folders = await admin.request(readFolders({
    filter,
  }))
  if (folders.length === 0) return null
  return folders[0] as DirectusFolder
}

export async function uploadFile(
  fileInfo: FileInfo,
  folder: UploadFolder | string,
  title: string,
  description?: string
) {
  const admin = await getAdminClient()
  const { mimetype: type, originalFilename: name, filepath: path, data } = fileInfo
  const formData = new FormData()
  formData.append('folder', folder)
  formData.append('title', title)
  formData.append('filename_download', name || 'photo')
  formData.append('filename_disk', name || 'photo')
  formData.append('description', description)
  formData.append('type', type)
  formData.append('filename', name)
  formData.append('filepath', path)
  formData.append('content_type', type)
  formData.append('mime_type', type)
  formData.append('type', type)
  formData.append('file', new Blob([data], {
    type,
  }))

  const file = await admin.request(uploadFiles(formData))
  return file
}




export async function importFile(
  url: string,
  folder: UploadFolder,
  title: string
): Promise<DirectusFile> {
  const admin = await getAdminClient()

  const file = await admin.request<DirectusFile>(importDirectusFile(url, {
    folder,
    title,
  }))
  return file as DirectusFile
}

export async function deleteFile(id: string) {
  const admin = await getAdminClient()
  await admin.request(deleteDirectusFile(id))
}

export async function getFile(id: string) {
  const admin = await getAdminClient()
  const file = await admin.request(readFile(id))
  if (!file) return null
  return file as unknown as DirectusFile
}

export async function updateFile(id: string, fileInfo: DirectusFile) {
  const admin = await getAdminClient()
  await admin.request(updateDirectusFile(id, fileInfo as any))
}


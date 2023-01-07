import { getAdminClient } from '.'
import formidable, { Fields, Files, File } from 'formidable'
import IncomingForm from 'formidable/Formidable'
import { NextApiRequest } from 'next'
import { Writable } from 'node:stream'
import FormData from 'form-data'
import { DirectusFile } from 'lib/models'

export enum UploadFolder {
  members = '8c3d5472-6b02-4056-affd-ab3d461b273d',
  profiles = '1ea29489-e282-4a1f-a981-8d578b6a1667',
  verification = '19610a61-14b2-4470-8952-e4d3502294cd',
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

export async function parseForm(req: NextApiRequest) {
  const chunks: never[] = []
  const { files: raw, form } = await formidablePromise(req, {
    ...formidableConfig,
    fileWriteStreamHandler: () => fileConsumer(chunks),
  })

  const fileInfo: File = raw.media as File
  const fileData = Buffer.concat(chunks)

  return { fileInfo, fileData, form }
}
// Service Calls ------------------------------------

export async function uploadFile(req: NextApiRequest, folder: UploadFolder, title: string) {
  const adminClient = await getAdminClient()
  const { fileInfo, fileData } = await parseForm(req)
  const { mimetype, originalFilename, filepath } = fileInfo
  const formData = new FormData()
  formData.append('folder', folder)
  formData.append('title', title)
  formData.append('filename', originalFilename)
  formData.append('mimetype', mimetype)
  formData.append('file', fileData, {
    filename: originalFilename,
    filepath,
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

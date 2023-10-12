
export enum UploadFolder {
  members = '8c3d5472-6b02-4056-affd-ab3d461b273d',
  profiles = '1ea29489-e282-4a1f-a981-8d578b6a1667',
  verification = '19610a61-14b2-4470-8952-e4d3502294cd',
}

export enum FolderType {
  private = 'private',
  public = 'public',
}

export type FileInfo = {
  mimetype: string
  originalFilename: string
  filepath: string
  data: Buffer
}

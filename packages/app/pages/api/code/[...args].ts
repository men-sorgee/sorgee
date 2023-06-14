import { baseUrl } from 'lib/config'

export default async function Code(req, res: any) {
  const QRCode = await import('qrcode')
  const { args, ...query } = req.query
  const url = `${baseUrl}/${Array.isArray(args) ? args.join('/') : args}?${new URLSearchParams(
    query
  )}`
  res.setHeader('Content-Type', 'image/png')

  QRCode.toFileStream(res, url, {
    type: 'png',
    width: 300,
    color: {
      dark: '#0038A8',
      light: '#ef9ac6',
    },
  })
}
export const config = {
  api: {
    bodyParser: false,
  },
}

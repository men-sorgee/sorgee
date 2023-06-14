import { baseUrl } from 'lib/config'
import { NextPageContext } from 'next'
import dynamic from 'next/dynamic'

const QrCode = dynamic<any>(() => import('react-qrcode-svg'), {
  ssr: false
})

interface Props {
  url: string
}

export async function getServerSideProps(context: NextPageContext) {
  const { args } = context.query
  const url = `${baseUrl}/${Array.isArray(args) ? args.join('/') : args}`
  return { props: { url } }
}

export default function QRPage({ url }: Props) {
  return (
    <QrCode
      bgColor="url(#gradientFill)"
      style={{ height: 'auto', maxWidth: '800px', width: '100%' }}
      data={url}
      viewBox={`0 0 256 256`}
      fgColor="#002265"
    >
      <linearGradient id="gradientFill" x1="0" y1="0" x2="1" y2=".7">
        <stop offset="0%" stopColor="#f857a6" />
        <stop offset="100%" stopColor="#ff5858" />
      </linearGradient>
    </QrCode>
  )
}

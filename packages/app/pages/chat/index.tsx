import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import Page from 'components/Page'
import { useUser } from 'hooks'
import { adminBaseUrl, adminUrl } from 'lib/config'
import { useRouter } from 'next/router'

export const getServerSideProps = async (context) => {
  const key =
    process.env.WHEREBY_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWV0aW5nSWQiOiI3MDYzNzU3MiIsInJvb21SZWZlcmVuY2UiOnsicm9vbU5hbWUiOiIvbWFpbmZhZDFhZjJlLTY3ZmMtNDlhNy1hZmRkLWYwMGYxMmM3OTY4ZSIsIm9yZ2FuaXphdGlvbklkIjoiMTc5NDg3In0sImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuc3J2LndoZXJlYnkuY29tIiwiaWF0IjoxNjc3NjY3MjUyLCJyb29tS2V5VHlwZSI6Im1lZXRpbmdIb3N0In0.BLP7vIes4Fne3_eTgCwFDOWZyWCeXwQTfIL3tmekSHI'
  return {
    props: {
      key,
    },
  }
}

export default function Chat({ key }) {
  const router = useRouter()
  const chatRoom = useRef<HTMLElement>(null)
  const { member, isStaff, loading, name, picture } = useUser()
  const [chatUrl, setChatUrl] = useState<string>(null)
  useEffect(() => {
    if (!loading && member && chatUrl == null) {
      const avatarUrl = member.picture ? `${adminBaseUrl}/asset/${member.picture}` : undefined
      setChatUrl(
        isStaff
          ? `https://guysnheat.whereby.com/mainfad1af2e-67fc-49a7-afdd-f00f12c7968e?roomKey=${key}&avatarUrl=${avatarUrl}}`
          : `https://guysnheat.whereby.com/mainfad1af2e-67fc-49a7-afdd-f00f12c7968e&avatarUrl=${avatarUrl}`
      )
    }
    if (chatRoom.current && chatUrl) {
      chatRoom.current.addEventListener('leave', (e) => {
        router.push('/chat/ended')
      })
    }
  }, [chatUrl, isStaff, key, loading, member, picture])

  return (
    <Page title="Member Chat" requireAuth={true}>
      <Script
        id="whereby"
        strategy="lazyOnload"
        type="module"
        src="https://cdn.srv.whereby.com/embed/v1.js"
      />
      {chatUrl && (
        <whereby-embed
          style={{ height: '70vh' }}
          ref={chatRoom}
          displayName={name}
          avatarUrl={avatarUrl}
          room={chatUrl}
          roomMode="group"
          topToolbar="on"
          breakout="on"
        ></whereby-embed>
      )}
    </Page>
  )
}

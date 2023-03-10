import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import Page from 'components/Page'
import { useUser } from 'hooks'
import { adminBaseUrl, adminUrl } from 'lib/config'
import { useRouter } from 'next/router'
import { DirectusFile } from 'lib/models'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { Box, Button } from '@chakra-ui/react'

export const getServerSideProps = async (context) => {
  const key = process.env.WHEREBY_API_KEY
  const { id } = context.query
  const meetingId = String(id)
  const response = await fetch(`https://api.whereby.dev/v1/meetings/${meetingId}`, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  })

  const meeting = await response.json()

  return {
    props: {
      key,
      meeting,
    },
  }
}

export default function VideoChat({ key, meeting }: { key: string; meeting: any }) {
  const router = useRouter()
  const chatRoom = useRef<HTMLElement>(null)
  const { member, isStaff, loading, name, picture } = useUser()
  const [chatUrl, setChatUrl] = useState<string>(null)
  useEffect(() => {
    if (!loading && member && chatUrl == null) {
      const picture = member.picture as DirectusFile
      const avatarUrl = member.picture ? `${adminBaseUrl}/assets/${picture?.id}` : undefined
      setChatUrl(
        isStaff
          ? `${meeting.roomUrl}?roomKey=${key}&avatarUrl=${avatarUrl}}`
          : `${meeting.roomUrl}?avatarUrl=${avatarUrl}`
      )
    }
    if (chatRoom.current && chatUrl) {
      chatRoom.current.addEventListener('leave', (e) => {
        router.push('/video/ended')
      })
    }
  }, [chatUrl, isStaff, key, loading, meeting?.roomUrl, member, picture, router])
  const handle = useFullScreenHandle()
  handle
  return (
    <Page title="Video Chat" requireAuth={true}>
      <Script
        id="whereby"
        strategy="lazyOnload"
        type="module"
        src="https://cdn.srv.whereby.com/embed/v1.js"
      />
      {chatUrl && (
        <Box minH="60vh">
          <Button onClick={handle.enter} variant="outline" color="white" mb="-9rem" ml="10rem">
            Full Screen
          </Button>
          <FullScreen handle={handle}>
            <whereby-embed
              style={{ height: handle.active ? '100vh' : '60vh', width: '100%' }}
              ref={chatRoom}
              displayName={name}
              room={chatUrl}
              roomMode="group"
              topToolbar="on"
              breakout="on"
            ></whereby-embed>
          </FullScreen>
        </Box>
      )}
    </Page>
  )
}

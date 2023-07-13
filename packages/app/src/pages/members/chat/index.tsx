'use client'
import { useUser } from 'hooks'
import { Messages, Page } from 'components'

export default function ChatPage({ id }: { id?: string }) {
  const { member, loading } = useUser()

  return (
    <Page title="Brother Chat" loading={loading} requireAuth={true} hideHeader>
      <Messages member={member} id={id} />
    </Page>
  )
}

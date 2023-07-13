'use client'
import { useUser } from 'hooks'
import { Messages } from 'components'

export default function ChatPage({ id }: { id?: string }) {
  const { member } = useUser()
  return <Messages member={member} id={id} />
}

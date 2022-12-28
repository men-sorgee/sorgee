import { signIn, useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Dropdown, Avatar, Badge } from 'react-daisyui'
import { ApplicationStatus, Member, MemberLevel } from 'lib/models'
import { LinkButton } from 'components/ui'
import { useNotifications } from 'lib/hooks'
import { getAssetUrl } from 'lib/utils'
interface Props {
  setVisible: (visible: boolean) => void
}

function getLetters(name: string) {
  return name
    .split(' ')
    .map((d) => d[0])
    .join('')
}

const UserAvatar = ({ setVisible }: Props) => {
  const [member, setMember] = useState<Member>(null)
  const { data: session, status } = useSession()
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  const [letters, setLetters] = useState<string | null>(null)
  const [level, setLevel] = useState<number>(-1)
  const [notificationCount, setNotificationCount] = useState<[number, number]>([0, 0])
  const { notifications } = useNotifications(status == 'authenticated')
  const messages = notifications?.filter((n) => n.type == 'message') || []
  const newEvents = notifications?.filter((n) => n.type == 'event') || []
  const [messageCount, eventCount] = notificationCount
  const {
    user: { application_status },
  } = session || { user: {} }

  useEffect(() => {
    if (status == 'authenticated' && session.user) {
      setNotificationCount([messageCount, eventCount])
      setMember(session.user as Member)
      const { picture, name, nickname } = session.user
      if (!photoSrc && picture) setPhotoSrc(getAssetUrl(picture))
      const initials = name ? getLetters(name) : nickname ? getLetters(nickname) : null
      if (!letters && initials) setLetters(initials)
      if (level == -1) setLevel(MemberLevel[session.user.user_type || 'subscriber'])
    }
  }, [letters, photoSrc, session?.user, level, notifications, messageCount, eventCount])

  const isMember = member && level >= 3 && application_status == 'approved'
  const isApplicant = ApplicationStatus[application_status] < ApplicationStatus['approved']
  return (
    <>
      {member ? (
        <Dropdown
          className="mr-2 bg-black text-white"
          onClick={() => setVisible(false)}
          color={'primary'}
        >
          <Avatar
            shape="circle"
            className="cursor-pointer rounded-full ring-2 ring-accent"
            color={'primary'}
            letters={letters}
            src={photoSrc}
            size={'sm'}
          >
            {letters}
          </Avatar>

          <Dropdown.Menu>
            {isMember && (
              <>
                <Dropdown.Item href="/member/events">
                  Events
                  {newEvents.length > 0 && <Badge color="accent">{newEvents.length}</Badge>}
                </Dropdown.Item>
                <Dropdown.Item href="/member/account">Account</Dropdown.Item>
                {messages.length > 0 && (
                  <Dropdown.Item href="/member/account">
                    Notifications
                    <Badge color="accent">{messages.length}</Badge>
                  </Dropdown.Item>
                )}

                <Dropdown.Item href="/member/invite">Invite</Dropdown.Item>
              </>
            )}
            {isApplicant && (
              <>
                <Dropdown.Item href="/apply/resume">Continue Application</Dropdown.Item>
              </>
            )}
            <Dropdown.Item
              onClick={() => {
                signOut({ callbackUrl: '/' })
              }}
            >
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <LinkButton href={`/enter`} color="ghost">
          Enter Site
        </LinkButton>
      )}
    </>
  )
}

export default UserAvatar

import { signIn, useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Avatar,
  Badge,
  Spinner,
  Link,
} from '@chakra-ui/react'
import { ApplicationStatus, Member, MemberLevel } from 'lib/models'
import { LinkButton } from 'components/ui'
import { useNotifications } from 'hooks'
import { getAssetUrl } from 'lib/utils'
interface Props {}

const UserAvatar = (_props: Props) => {
  const [member, setMember] = useState<Member>(null)
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState<boolean>(true)
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [level, setLevel] = useState<number>(-1)
  const { notifications } = useNotifications(status == 'authenticated')
  const messages = notifications?.filter((n) => n.type == 'message') || []
  const {
    user: { application_status },
  } = session || { user: {} }

  useEffect(() => {
    if (!loading && status == 'loading') {
      setLoading(true)
    }
    if (loading && status != 'loading') {
      setLoading(false)
    }
    if (status == 'authenticated' && session.user) {
      setMember(session.user as Member)
      const { picture, first_name, last_name, nickname } = session.user
      if (!photoSrc && picture) setPhotoSrc(getAssetUrl(picture))
      if (!name) setName(nickname || `${first_name} ${last_name}}`)
      if (level == -1) setLevel(MemberLevel[session.user.user_type || 'subscriber'])
    }
  }, [name, photoSrc, session?.user, level, status, loading, notifications])

  const isMember = member && level >= 3 && application_status == 'approved'
  const isApplicant = ApplicationStatus[application_status] < ApplicationStatus['approved']
  if (loading) return <Spinner />
  return (
    <>
      {member ? (
        <>
          <Menu placement="bottom-start">
            <MenuButton>
              <Avatar size={'sm'} cursor={'pointer'} name={name} src={photoSrc} />
            </MenuButton>
            <MenuList bg="black">
              {isApplicant && (
                <MenuItem bg="black" as={Link} href="/member/apply/resume">
                  Application
                </MenuItem>
              )}
              {isMember && (
                <>
                  <MenuItem bg="black" as={Link} href="/member/events">
                    Events
                  </MenuItem>
                  <MenuItem bg="black" as={Link} href="/member/account">
                    Account
                  </MenuItem>
                  {messages.length > 0 && (
                    <MenuItem bg="black" as={Link} href="/member/account">
                      Notifications
                      <Badge borderRadius="full" color="accent">
                        {messages.length}
                      </Badge>
                    </MenuItem>
                  )}
                  <MenuItem bg="black" as={Link} href="/member/invite">
                    Invite
                  </MenuItem>
                </>
              )}
              <MenuDivider />
              <MenuItem
                bg="black"
                as={Link}
                href={`/api/auth/signout`}
                onClick={() => {
                  signOut({ callbackUrl: '/' })
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      ) : (
        <LinkButton
          href={`/api/auth/signin`}
          fontWeight={600}
          color={'white'}
          bg={'primary'}
          onClick={(e) => {
            e.preventDefault()
            signIn(null, { callbackUrl: '/apply/resume' })
          }}
        >
          members
        </LinkButton>
      )}
    </>
  )
}

export default UserAvatar

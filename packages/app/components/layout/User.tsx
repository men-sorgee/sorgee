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
  LinkOverlay,
} from '@chakra-ui/react'
import { Member, MemberLevel } from 'lib/models'
import { LinkButton } from 'components/ui'
import { useNotifications } from 'hooks'
import { getAssetUrl } from 'lib/utils'
import NextLink from 'next/link'
interface Props {}

const UserAvatar = (_props: Props) => {
  const [member, setMember] = useState<Member>(null)
  const { data: session, status } = useSession()
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [level, setLevel] = useState<number>(-1)
  const { notifications } = useNotifications(status == 'authenticated')
  const messages = notifications?.filter((n) => n.type == 'message') || []
  const {
    user: { application_status },
  } = session || { user: {} }

  useEffect(() => {
    if (status == 'authenticated' && session.user) {
      setMember(session.user as Member)
      const { picture, first_name, last_name, nickname } = session.user
      if (!photoSrc && picture) setPhotoSrc(getAssetUrl(picture))
      if (!name) setName(nickname || `${first_name} ${last_name}}`)
      if (level == -1) setLevel(MemberLevel[session.user.user_type || 'subscriber'])
    }
  }, [name, photoSrc, session?.user, level])

  return (
    <>
      {member ? (
        <>
          <Menu placement="bottom-start">
            <MenuButton
              as={Avatar}
              className="ring-accent cursor-pointer rounded-full ring-2"
              name={name}
              src={photoSrc}
              size={'lg'}
            ></MenuButton>{' '}
            <MenuList>
              {member && MemberLevel[member.user_type] >= 3 && application_status == 'approved' && (
                <>
                  <MenuItem>
                    <LinkButton href="/member/events">Events</LinkButton>
                  </MenuItem>
                  <MenuItem>
                    <LinkButton href="/member/account">Account</LinkButton>
                  </MenuItem>
                  {messages.length > 0 && (
                    <MenuItem>
                      <LinkOverlay as={NextLink} href="/member/account">
                        Notifications
                        <Badge borderRadius="full" color="accent">
                          {messages.length}
                        </Badge>
                      </LinkOverlay>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <LinkOverlay as={NextLink} href="/member/invite">
                      Invite
                    </LinkOverlay>
                  </MenuItem>
                </>
              )}
              <MenuDivider />
              <MenuItem>
                <LinkOverlay
                  as={NextLink}
                  href={`/api/auth/signout`}
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                  }}
                >
                  Logout
                </LinkOverlay>
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

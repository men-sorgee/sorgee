import { signIn, useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  Box,
  Center,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Avatar,
  Spinner,
  Link,
  Text,
  AvatarBadge,
} from '@chakra-ui/react'
import { ApplicationStatus, Member, MemberLevel } from 'lib/models'
import { LinkButton } from 'components/ui'
import Notifications from './Notifications'
import { getAssetUrl } from 'lib/utils'
import {
  CalendarIcon,
  CogIcon,
  ExternalLinkIcon,
  UserGroupIcon,
  LogoutIcon,
  QrcodeIcon,
} from '@heroicons/react/outline'
import { useSite } from 'hooks/use-site'
import { UserBadge } from 'components/ui'
interface Props {}

const UserAvatar = (_props: Props) => {
  const [notificationBadge, setNotificationBadge] = useState<boolean>(false)
  const [member, setMember] = useState<Member>(null)
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState<boolean>(true)
  const [pictureSrc, setPictureSrc] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [level, setLevel] = useState<number>(-1)
  const { site } = useSite()
  const {
    user: { application_status },
  } = session || { user: {} }
  const showApply = !site?.invite_only
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
      if (!pictureSrc && picture) setPictureSrc(getAssetUrl(picture))
      if (!name) setName(nickname || `${first_name} ${last_name}}`)
      if (level == -1) setLevel(MemberLevel[session.user.user_type || 'subscriber'])
    }
  }, [notificationBadge, member, name, pictureSrc, session?.user, level, status, loading, site])

  const isMember = member && level >= 3 && application_status == 'approved'
  const isApplicant = ApplicationStatus[application_status] < ApplicationStatus['approved']

  return (
    <>
      {member ? (
        <>
          <Menu placement="bottom">
            <MenuButton cursor={'pointer'}>
              <Avatar bg="accent.500" cursor={'pointer'} name={name} src={pictureSrc} color="white">
                {notificationBadge && <AvatarBadge borderWidth="thin" boxSize="1em" bg="red" />}
              </Avatar>
            </MenuButton>

            <MenuList bg="black" alignItems={'center'}>
              <Box p={4} m={2} bgGradient="linear(to-bl, primary.300, accent.300)">
                <Center>
                  <Avatar src={pictureSrc} color="white" bg="primary.500" />
                </Center>
                <Center>
                  <Text fontWeight="bold" color="black">
                    {member?.nickname || member.first_name} <br />
                  </Text>
                </Center>
                <Center>
                  <UserBadge user_type={member?.user_type} />
                </Center>
              </Box>
              <MenuDivider />
              {isApplicant && (
                <MenuItem
                  icon={<ExternalLinkIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  href="/apply"
                >
                  Continue Application
                </MenuItem>
              )}
              {isMember && (
                <>
                  <MenuItem
                    icon={<CogIcon color={'white'} width={'1.5rem'} />}
                    bg="black"
                    _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                    as={Link}
                    href="/member/account"
                  >
                    Account / Profile
                  </MenuItem>
                  <Notifications setNotificationBadge={setNotificationBadge} />
                  <MenuItem
                    icon={<CalendarIcon color={'white'} width={'1.5rem'} />}
                    bg="black"
                    _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                    as={Link}
                    href="/member/events"
                  >
                    Event Invites
                  </MenuItem>
                  <MenuItem
                    icon={<UserGroupIcon color={'white'} width={'1.5rem'} />}
                    bg="black"
                    _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                    as={Link}
                    href="/member/invite"
                  >
                    Invite Friend
                  </MenuItem>
                  {member.user_type == MemberLevel[MemberLevel.staff] && (
                    <MenuItem
                      icon={<QrcodeIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/member/scan"
                    >
                      Scan
                    </MenuItem>
                  )}
                </>
              )}
              <MenuDivider />
              <MenuItem
                icon={<LogoutIcon color={'white'} width={'1.5rem'} />}
                bg="black"
                _hover={{ bg: 'gray.400', textDecoration: 'none' }}
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
        !loading && (
          <>
            <LinkButton
              href={`/api/auth/signin`}
              fontWeight={600}
              variant="ghost"
              _hover={{ textDecoration: 'none' }}
              onClick={(e) => {
                e.preventDefault()
                signIn()
              }}
            >
              members
            </LinkButton>
            {showApply && (
              <LinkButton
                href={`/apply`}
                _hover={{ textDecoration: 'none' }}
                fontWeight={600}
                colorScheme={'accent'}
                onClick={(e) => {
                  e.preventDefault()
                  signIn(null, { callbackUrl: '/apply' })
                }}
              >
                apply
              </LinkButton>
            )}
          </>
        )
      )}
    </>
  )
}

export default UserAvatar

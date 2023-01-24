import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Box, Menu, MenuButton, MenuItem, MenuList, MenuDivider, Link } from '@chakra-ui/react'
import { ApplicationStatus, MemberLevel } from 'lib/models'
import { LinkButton, UserAvatar, UserCard } from 'components/ui'
import Notifications from './Notifications'
import {
  CalendarIcon,
  CogIcon,
  ExternalLinkIcon,
  UserGroupIcon,
  LogoutIcon,
  QrcodeIcon,
  UserIcon,
} from '@heroicons/react/outline'
import { useSite } from 'hooks/use-site'

interface Props {}

export default function UserMenu(_props: Props) {
  const { data: session } = useSession()
  const { site, loading } = useSite()
  const { user } = session || {}
  const { application_status, user_type } = user || {}
  const [level, setLevel] = useState<number>(-1)
  const [approved, setApproved] = useState<boolean>(false)

  useEffect(() => {
    if (!loading && application_status && level == -1) {
      setLevel(MemberLevel[user_type])
      setApproved(ApplicationStatus[application_status] >= ApplicationStatus.approved)
    }
  }, [level, loading, application_status, user_type, approved])

  const isMember = approved && level >= MemberLevel.pledge
  const isStaff = isMember && level >= MemberLevel.staff
  const isApplicant = !approved
  const showApply = !site?.invite_only

  return (
    <>
      {user ? (
        <>
          <Menu placement="bottom">
            <MenuButton cursor={'pointer'}>
              <UserAvatar />
            </MenuButton>

            <MenuList bg="black" alignItems={'center'}>
              <Box p={4} m={2} bgGradient="linear(to-bl, primary.300, accent.300)">
                <UserCard />
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
                    Account Settings
                  </MenuItem>
                  <MenuItem
                    icon={<UserIcon color={'white'} width={'1.5rem'} />}
                    bg="black"
                    _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                    as={Link}
                    href="/member/profile"
                  >
                    Member Profile
                  </MenuItem>
                  <Notifications />
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
                  {isStaff && (
                    <>
                      <MenuDivider />
                      <MenuItem
                        icon={<CalendarIcon color={'white'} width={'1.5rem'} />}
                        bg="black"
                        _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                        as={Link}
                        href="/events"
                      >
                        All Events
                      </MenuItem>
                      <MenuItem
                        icon={<QrcodeIcon color={'white'} width={'1.5rem'} />}
                        bg="black"
                        _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                        as={Link}
                        href="/member/scan"
                      >
                        Scan
                      </MenuItem>
                    </>
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
      )}
    </>
  )
}

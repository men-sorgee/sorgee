import { signIn, signOut } from 'next-auth/react'
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  MenuDivider,
  Link,
  MenuGroup,
} from '@chakra-ui/react'
import { LinkButton, MemberAvatar, UserCard } from 'components/controls'
import Notifications from './Notifications'
import {
  CalendarIcon,
  InboxIcon,
  CogIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  UserGroupIcon,
  LogoutIcon,
  QrcodeIcon,
  UserIcon,
  CameraIcon,
  MoonIcon,
  SunIcon,
  DatabaseIcon,
  AdjustmentsIcon,
} from '@heroicons/react/outline'
import { useUser, useSite } from 'hooks'

interface Props {}

export default function UserMenu(_props: Props) {
  const { colorMode, toggleColorMode } = useColorMode()
  const { site } = useSite()
  const { authenticated, user, member, isApplicant, isMember, isStaff } = useUser()
  const showApply = !site?.invite_only
  const person = member || user

  const memberMenu = [
    {
      icon: <UserGroupIcon color={'white'} width={'1.5rem'} />,
      label: 'Members',
      href: '/members',
    },
  ]
  return (
    <>
      {authenticated ? (
        <Menu placement="bottom">
          <MenuButton cursor={'pointer'}>
            <MemberAvatar />
          </MenuButton>

          <MenuList bg="black" maxH="80vh" overflowY="auto">
            <Box p={4} m={2} mt={0} bgGradient="linear(to-bl, primary.300, accent.300)">
              <UserCard user={person} />
              <span id="account-email" hidden>
                {person?.email}
              </span>
            </Box>
            <MenuDivider />
            <MenuItem
              icon={
                colorMode === 'light' ? (
                  <MoonIcon color={'white'} width={'1.5rem'} />
                ) : (
                  <SunIcon color={'white'} width={'1.5rem'} />
                )
              }
              bg="black"
              _hover={{ bg: 'gray.400', textDecoration: 'none' }}
              onClick={toggleColorMode}
              aria-label="Toggle Theme"
            >
              Set Theme To {colorMode === 'light' ? 'Dark' : 'Light'}
            </MenuItem>
            {member && <Notifications member={member} />}

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
                <MenuDivider />
                <MenuItem
                  icon={<CogIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  href="/member/settings"
                >
                  Settings
                </MenuItem>

                <MenuItem
                  icon={<UserIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  href="/member/profile"
                >
                  Profile
                </MenuItem>
                <MenuItem
                  icon={<CameraIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  href="/member/photos"
                >
                  Edit Photos
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<CalendarIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  href="/calendar"
                >
                  Events
                </MenuItem>
                <MenuItem
                  icon={<InboxIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  href="/member/invites"
                >
                  Your Events
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  icon={<UserGroupIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  href="/members"
                >
                  Find Men
                </MenuItem>
                <MenuItem
                  icon={<ArrowRightIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  href="/members/invite"
                >
                  Invite Friend
                </MenuItem>
                {isStaff && (
                  <>
                    <MenuDivider />
                    <MenuItem
                      icon={<DatabaseIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      target="_blank"
                      href="https://admin.guysnheat.com"
                    >
                      Administration
                    </MenuItem>
                    <MenuItem
                      icon={<CalendarIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/admin/event"
                    >
                      Event Admin
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
                    <MenuItem
                      icon={<AdjustmentsIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/styles"
                    >
                      Styles
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

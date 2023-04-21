import { signIn, signOut } from 'next-auth/react'
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  MenuDivider,
} from '@chakra-ui/react'
import { ButtonLink, MemberAvatar, MemberIcon } from 'components/controls'

import Link from 'next/link'
import {
  CalendarIcon,
  InboxIcon,
  CogIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
  UserGroupIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  ViewfinderCircleIcon,
  UserIcon,
  CameraIcon,
  MoonIcon,
  SunIcon,
  ServerStackIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline'
import { useUser, useSite } from 'hooks'
import { MemberLevel, ApplicationStatus } from 'lib/models'
import { pledgeSurvey } from '../../lib/config'
interface Props {}

export default function UserMenu(_props: Props) {
  const { colorMode, toggleColorMode } = useColorMode()
  const { site } = useSite()
  const { member, isApplicant, isMember, isStaff, level } = useUser(
    MemberLevel.applicant,
    ApplicationStatus.apply
  )
  const showApply = !site?.invite_only

  return (
    <>
      {member ? (
        <Menu placement="bottom">
          <MenuButton cursor={'pointer'}>
            <MemberAvatar member={member} />
          </MenuButton>

          <MenuList bg="black" maxH="80vh" overflowY="auto">
            <Box p={4} m={2} mt={0} bgGradient="linear(to-bl, primary.300, accent.300)">
              <MemberIcon member={member} />
              <span id="account-email" hidden>
                {member?.email}
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

            {isMember && (
              <>
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
                {level === MemberLevel.pledge && (
                  <MenuItem
                    icon={<ArrowRightOnRectangleIcon color={'white'} width={'1.5rem'} />}
                    bg="black"
                    _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                    as={Link}
                    href={`/survey/${pledgeSurvey}`}
                  >
                    Pledge Survey
                  </MenuItem>
                )}

                {level > MemberLevel.pledge && (
                  <>
                    <MenuDivider />
                    <MenuItem
                      icon={<CalendarIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/events"
                    >
                      Events
                    </MenuItem>

                    <MenuItem
                      icon={<UserGroupIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/members"
                    >
                      Members
                    </MenuItem>
                    <MenuItem
                      icon={<UsersIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/member/buddies"
                    >
                      Buddies
                    </MenuItem>
                    {level > MemberLevel.inductee && (
                      <MenuItem
                        icon={<PaperAirplaneIcon color={'white'} width={'1.5rem'} />}
                        bg="black"
                        _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                        as={Link}
                        href="/members/invite"
                      >
                        Invite Friend
                      </MenuItem>
                    )}
                  </>
                )}
                {isStaff && (
                  <>
                    <MenuDivider />
                    <MenuItem
                      icon={<ServerStackIcon color={'white'} width={'1.5rem'} />}
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
                      icon={<ViewfinderCircleIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/admin/scan"
                    >
                      Scan
                    </MenuItem>
                    <MenuItem
                      icon={<PaintBrushIcon color={'white'} width={'1.5rem'} />}
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

            {isApplicant && (
              <>
                <MenuDivider />

                <MenuItem
                  icon={<ArrowTopRightOnSquareIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  href="/apply"
                >
                  Continue Application
                </MenuItem>
              </>
            )}
            <MenuDivider />
            <MenuItem
              icon={<ArrowRightOnRectangleIcon color={'white'} width={'1.5rem'} />}
              bg="black"
              _hover={{ bg: 'gray.400', textDecoration: 'none' }}
              as={Link}
              href={`/api/auth/signout`}
              onClick={(e) => {
                e.preventDefault()
                signOut({ redirect: true, callbackUrl: '/' })
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <>
          <ButtonLink
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
          </ButtonLink>
          {showApply && (
            <ButtonLink
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
            </ButtonLink>
          )}
        </>
      )}
    </>
  )
}

import { signIn, signOut } from 'next-auth/react'
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  MenuDivider,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { ButtonLink, MemberAvatar, MemberIcon } from 'components/controls'
import Link from 'next/link'
import {
  CalendarIcon,
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
  CreditCardIcon
} from '@heroicons/react/24/outline'
import { useUser, useSite } from 'hooks'
import { MemberLevel, ApplicationStatus } from 'lib/models'
import { pledgeSurvey } from 'lib/config'

interface Props { }

export default function UserMenu(_props: Props) {
  const { colorMode, toggleColorMode } = useColorMode()
  const { site } = useSite()
  const { member, authenticated, isApplicant, isMember, isStaff, level, hasFeature, loading } = useUser({
    forceLogin: false,
  })
  const showApply = !site?.invite_only

  const toast = useToast()

  // useEffect(() => {
  //   if (!loading && member?.notifications?.length) {
  //     member.notifications.forEach((n) => {
  //       toast({
  //         title: 'Notification!',
  //         description: n.message,
  //         status: 'info',
  //         isClosable: true,
  //         onCloseComplete: () => {
  //         }
  //       })
  //     })
  //   }
  // }, [loading, member?.notifications, member?.notifications?.length, toast])

  const hasDirectory = hasFeature('view_directory')
  const hasChat = hasFeature('chat')
  const hasBuddyList = hasFeature('buddy_list')
  const hasEvents = isMember && level >= MemberLevel.brother

  if (loading) return <Spinner />

  return (
    <>
      {authenticated ? (
        <Menu placement="bottom">
          <MenuButton cursor={'pointer'}>{member && <MemberAvatar member={member} />}</MenuButton>

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
                  icon={<CreditCardIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link} target='_blank' rel='noopener noreferrer'
                  href="/api/stripe/portal"
                >
                  Billing
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
                    {hasEvents && <MenuItem
                      icon={<CalendarIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/events"
                    >
                      Events
                    </MenuItem>}

                    {hasDirectory && <MenuItem
                      icon={<UserGroupIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/members"
                    >
                      Members
                    </MenuItem>}
                    {hasBuddyList && <MenuItem
                      icon={<UsersIcon color={'white'} width={'1.5rem'} />}
                      bg="black"
                      _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                      as={Link}
                      href="/member/buddies"
                    >
                      Buddies
                    </MenuItem>}
                    {level >= MemberLevel.brother && (
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

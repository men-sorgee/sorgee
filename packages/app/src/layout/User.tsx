import { ButtonLink, MemberAvatar, MemberIcon } from "components";
import { useUser } from "hooks";
import { pledgeSurvey } from "lib/config";
import { MemberLevel, MembershipType, Site } from "lib/models";
import { signIn, signOut } from "next-auth/react";
import NextLink from "next/link";
import { Router } from "next/router";

import {
  Box,
  Flex,
  Hide,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Select,
  Show,
  Spacer,
  Spinner,
  useColorMode
} from "@chakra-ui/react";
import {
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CameraIcon,
  ChatBubbleBottomCenterIcon as ChatIcon,
  CogIcon,
  CreditCardIcon,
  IdentificationIcon,
  MoonIcon,
  PaintBrushIcon,
  PaperAirplaneIcon,
  ServerStackIcon,
  SquaresPlusIcon,
  SunIcon,
  UserCircleIcon,
  UserGroupIcon,
  UsersIcon,
  ViewfinderCircleIcon
} from "@heroicons/react/24/outline";

interface Props {
  site: Site
  router: Router
}

export default function UserMenu({ site, router }: Props) {
  const { colorMode, toggleColorMode } = useColorMode()

  const {
    member,
    authenticated,
    subscription,
    isApplicant,
    isMember,
    isBrother,
    isStaff,
    level,
    hasFeature,
    loading,
    mutate
  } = useUser({
    redirectsEnabled: false,
  })
  const showApply = !site?.invite_only
  const hideSubscribe = router.pathname.startsWith('/member/subscription')
  const hasDirectory = level >= MemberLevel.brother && hasFeature('view_directory')
  const hasBuddyList = level >= MemberLevel.brother && hasFeature('buddy_list')
  const hasChat = level >= MemberLevel.brother && hasFeature('chat')

  if (loading) return <Spinner />

  return (
    <>
      {authenticated ? (
        <Menu placement="bottom">
          <Flex gap={4} justify="end" align="center">
            <Spacer />
            {level == MemberLevel.brother &&
              subscription == MembershipType.none &&
              !hideSubscribe && (
                <ButtonLink flexShrink={1} size="sm" href="/member/subscription" bg="primary.500" color="white">
                  <Hide below="md">Want More Features?</Hide>
                  <Show below="md">Upgrade</Show>
                </ButtonLink>
              )}
            <MenuButton cursor={'pointer'}>
              {member && <MemberAvatar member={member} size={['sm', 'md', 'lg']} />}
            </MenuButton>
          </Flex>
          <MenuList bg="black" maxH="80vh" overflowY="auto" zIndex="10">
            <Box p={4} m={2} mt={0} bgGradient="linear(to-bl, primary.300, accent.300)">
              <MemberIcon member={member} size={['sm', 'md']} />
              <span id="account-email" hidden>
                {member?.email}
              </span>
            </Box>
            <MenuItem>
              <Select name="presence"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                onChange={(e) => {
                  return mutate({
                    presence: e.target.value as any
                  })
                }}
                value={member?.presence}>
                <option value="online">Online</option>
                <option value="away">Away</option>
                <option value="offline">Offline</option>
              </Select>
            </MenuItem>
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
            <MenuDivider />
            {isMember && (
              <>
                <MenuItem
                  icon={<SquaresPlusIcon color={'white'} width={'1.5rem'} />}
                  bg="black"
                  _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                  as={Link}
                  rel="noopener noreferrer"
                  href="/member/account"
                >
                  Account
                </MenuItem>
                {!isStaff && isBrother && member.membership_type != 'none' && (
                  <MenuItem
                    icon={<CreditCardIcon color={'white'} width={'1.5rem'} />}
                    bg="black"
                    _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                    as={Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    href="/api/stripe/portal"
                  >
                    Billing
                  </MenuItem>
                )}

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
                  icon={<IdentificationIcon color={'white'} width={'1.5rem'} />}
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

                {level >= MemberLevel.inductee && (
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
                    {hasChat && (
                      <MenuItem
                        icon={<ChatIcon color={'white'} width={'1.5rem'} />}
                        bg="black"
                        _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                        as={Link}
                        href="/members/chat"
                      >
                        Brother Chat
                      </MenuItem>
                    )}
                    {hasDirectory && (
                      <MenuItem
                        icon={<UserGroupIcon color={'white'} width={'1.5rem'} />}
                        bg="black"
                        _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                        as={Link}
                        href="/members"
                      >
                        Members
                      </MenuItem>
                    )}
                    {level >= MemberLevel.brother && (
                      <MenuItem
                        icon={<UserCircleIcon color={'white'} width={'1.5rem'} />}
                        bg="black"
                        _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                        as={Link}
                        href="/members/pledges"
                      >
                        Meet Pledges
                      </MenuItem>
                    )}
                    {hasBuddyList && (
                      <MenuItem
                        icon={<UsersIcon color={'white'} width={'1.5rem'} />}
                        bg="black"
                        _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                        as={Link}
                        href="/member/buddies"
                      >
                        Buddies
                      </MenuItem>
                    )}
                    {level >= MemberLevel.brother && (
                      <>
                        <MenuItem
                          icon={<PaperAirplaneIcon color={'white'} width={'1.5rem'} />}
                          bg="black"
                          _hover={{ bg: 'gray.400', textDecoration: 'none' }}
                          as={Link}
                          href="/members/invite"
                        >
                          Invite Friend
                        </MenuItem>
                      </>
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
        <Flex direction={['column', 'row']} align="center" justify="end">
          <Link
            mr={2}
            as={NextLink}
            href={`/api/auth/signin`}
            fontWeight={600}
            size={['sm', 'md']}
            color="white"
            onClick={(e) => {
              e.preventDefault()
              signIn(null, {
                callbackUrl: '/api/my/home',
              })
            }}
          >
            sign in
          </Link>
          {showApply && (
            <>
              <Show above="sm">&nbsp;| &nbsp;</Show>
              <Link
                as={NextLink}
                size={['sm', 'md']}
                href={`/register`}
                color="white"
                fontWeight={600}
              >
                sign up
              </Link>
            </>
          )}
        </Flex>
      )}
    </>
  )
}

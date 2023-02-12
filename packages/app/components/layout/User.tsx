import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Box, Menu, MenuButton, MenuItem, MenuList, MenuDivider, Link } from '@chakra-ui/react'
import { ApplicationStatus, MemberLevel } from 'lib/models'
import { LinkButton, UserAvatar, UserCard } from 'components/controls'
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
import { useAuth } from 'hooks'

interface Props {}

export default function UserMenu(_props: Props) {
  const { user, isApplicant, isMember, isStaff, showApply } = useAuth()
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
                <UserCard user={user} />
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
                    href="/member/settings"
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
                  <Notifications member={user} />
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

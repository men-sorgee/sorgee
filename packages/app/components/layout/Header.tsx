import Link from 'next/link';
import {
  Navbar,
  Dropdown,
  Avatar,
  Button,
  Menu,
  Tooltip,
  Badge
} from 'react-daisyui';
import 'react';
import { Logo } from 'components/icons';
import { useAppUser } from 'lib/hooks/use-member';
import { useMetaContext } from '../../lib/hooks/use-meta-context';
import { MemberLevel } from '../../lib/services/directus';

export default function Header({ path }: { path: string }) {
  const { user, member, loading } = useAppUser();
  const { pages } = useMetaContext();
  const messages =
    member?.notifications?.filter((n) => n.type == 'message') || [];
  const newEvents =
    member?.notifications?.filter((n) => n.type == 'event') || [];
  if (loading) return null;
  return (
    <header className=" sticky top-0 z-40 bg-black transition-all duration-150 ">
      <Navbar className="mx-auto flex max-w-5xl justify-between bg-black py-3 px-4">
        <div className="flex-1">
          <a href="/">
            <Logo width="70" height="70" className="mr-3 cursor-pointer" />
          </a>
          <div className="bg-gradient-to-r from-pink-500  to-purple-900 bg-clip-text text-left font-serif text-xl font-extrabold leading-5 text-transparent md:text-left lg:text-4xl">
            GuysNHeat
          </div>
        </div>

        <div className="flex-grow">
          <Menu horizontal className="items-end gap-2 p-0">
            {pages?.map((page, i) => (
              <Menu.Item key={i}>
                <a
                  href={page.path}
                  className={`btn ${path == page.path ? '' : 'btn-ghost'}`}
                >
                  {page.title}
                </a>
              </Menu.Item>
            ))}
          </Menu>
        </div>

        {user ? (
          <Dropdown
            vertical="end"
            horizontal="center"
            className="mr-2 bg-black text-gray-500"
          >
            <Tooltip message={user?.email} position="left">
              <Avatar
                className="cursor-pointer rounded-full ring-2 ring-accent"
                shape="circle"
                size={70}
                letters={user?.email}
                src={
                  member?.picture
                    ? `/api/asset/${member.picture}`
                    : user?.picture
                }
              />
            </Tooltip>

            <Dropdown.Menu>
              {MemberLevel[member?.user_type || 'subscriber'] > 3 && (
                <>
                  <Dropdown.Item href="/member/events">
                    Events
                    {newEvents.length > 0 && (
                      <Badge color="accent">{newEvents.length}</Badge>
                    )}
                  </Dropdown.Item>
                  <Dropdown.Item href="/member/account">Account</Dropdown.Item>
                  <Dropdown.Item href="/member/account?t=4">
                    Notifications
                    {messages.length > 0 && (
                      <Badge color="accent">{messages.length}</Badge>
                    )}
                  </Dropdown.Item>

                  <Dropdown.Item href="/member/invite">Invite</Dropdown.Item>
                </>
              )}
              <Dropdown.Item href="/api/auth/logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <a href="/api/auth/login" className="btn-ghost btn">
            Login
          </a>
        )}
      </Navbar>
    </header>
  );
}

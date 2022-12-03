import Link from 'next/link';
import { Navbar, Dropdown, Avatar, Button, Menu, Tooltip } from 'react-daisyui';
import 'react';
import { Logo } from 'components/icons';
import { useAppUser } from 'lib/hooks/use-member';
import { useMetaContext } from '../../lib/hooks/use-meta-context';

export default function Header({ path }: { path: string }) {
  const { user, member } = useAppUser();
  const { pages } = useMetaContext();
  return (
    <header className=" sticky top-0 z-40 bg-black transition-all duration-150 ">
      <Navbar className="mx-auto max-w-5xl justify-between bg-black py-3 px-4">
        <div className="flex-1">
          <a href="/">
            <Logo width="70" height="70" className="mr-3 cursor-pointer" />
          </a>
          <div className="bg-gradient-to-r from-pink-500  to-purple-900 bg-clip-text text-left font-serif text-xl font-extrabold leading-5 text-transparent md:text-left lg:text-4xl">
            GuysNHeat
          </div>
        </div>

        <div className="flex-grow text-right">
          <Menu horizontal className="gap-2 p-0">
            {!user && (
              <Menu.Item>
                <Link href="/api/auth/login" className="btn-ghost btn">
                  Login
                </Link>
              </Menu.Item>
            )}
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

        {user && (
          <Dropdown
            vertical="end"
            horizontal="center"
            className="mr-2 bg-black text-gray-500"
          >
            <Tooltip message={user?.email} position="left">
              <Avatar
                className="cursor-pointer"
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
              {member?.application_status == 'approved' && (
                <>
                  <Dropdown.Item href="/member/account">Account</Dropdown.Item>
                  <Dropdown.Item href="/member/invite">Invite</Dropdown.Item>
                </>
              )}
              <Dropdown.Item href="/api/auth/logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Navbar>
    </header>
  );
}

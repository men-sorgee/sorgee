import Link from 'next/link';
import { Navbar, Dropdown, Avatar, Button, Menu, Tooltip } from 'react-daisyui';
import 'react';
import { Logo } from 'components/icons';
import { useAppUser } from 'lib/hooks/use-member';
import { useMetaContext } from '../../lib/hooks/user-meta-context';

export default function Header({ path }: { path: string }) {
  const { user, member } = useAppUser();
  const { pages } = useMetaContext();
  return (
    <header className=" sticky top-0 z-40 bg-black transition-all duration-150 ">
      <Navbar className="mx-auto max-w-4xl justify-between bg-black px-4">
        <div className="flex-1">
          <a href="/">
            <Logo
              width="70"
              height="70"
              className="mr-3 h-6 cursor-pointer sm:h-10 md:h-20"
            />
          </a>
        </div>
        <div className="my-6 flex-grow self-center whitespace-nowrap text-center text-3xl font-extrabold leading-5 text-primary md:text-left lg:text-4xl">
          GuysNHeat
        </div>

        <div className="flex-none">
          <Menu horizontal className="p-0">
            {!user && (
              <Menu.Item>
                <Link href="/api/auth/login" className="btn-ghost btn">
                  Login
                </Link>
              </Menu.Item>
            )}
            {pages?.map((page, i) => (
              <Menu.Item>
                <Link href={page.path} className="" key={i}>
                  <a>{page.title || 'Home'}</a>
                </Link>
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
            <Button color="ghost">
              <Tooltip color="ghost" message={user?.email} position="left">
                <Avatar
                  shape="circle"
                  size={70}
                  letters={member?.first_name[0] || 'X'}
                  src={member?.picture || user?.picture}
                />
              </Tooltip>
            </Button>

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

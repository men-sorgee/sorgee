import Link from 'next/link';
import {
  Navbar,
  Dropdown,
  Avatar,
  Menu,
  Tooltip,
  Badge,
  Button
} from 'react-daisyui';
import 'react';
import { Logo } from 'components/icons';
import { Member, MemberLevel } from '../../lib/services/directus';
import { UserProfile } from '@auth0/nextjs-auth0';

export default function Header({
  user,
  member,
  toggleDrawer,
  setVisible,
  visible
}: {
  user: UserProfile;
  member: Member;
  toggleDrawer: () => void;
  visible: boolean;
  setVisible: (v: boolean) => void;
}) {
  const messages =
    member?.notifications?.filter((n) => n.type == 'message') || [];
  const newEvents =
    member?.notifications?.filter((n) => n.type == 'event') || [];
  return (
    <header className="sticky top-0 z-40 bg-black transition-all duration-150 ">
      <Navbar className="flex max-w-3xl justify-between bg-black py-3 px-4 ">
        <Button
          className="swap-rotate swap btn-secondary btn-circle btn"
          onClick={toggleDrawer}
          size="lg"
        >
          <input type="checkbox" defaultChecked={visible} />
          <svg
            className="icon-lg fill-white-400 swap-off"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </Button>
        <div className="flex-grow" onClick={() => setVisible(false)}>
          <Link href="/">
            <a className="mx-auto">
              <Logo
                width="70"
                height="70"
                className="md:w-70 mx-auto hidden w-fit cursor-pointer md:block"
              />

              <Logo
                width="40"
                height="40"
                className="mx-auto mr-3 w-fit cursor-pointer md:hidden"
              />
            </a>
          </Link>
        </div>

        {user ? (
          <Dropdown
            vertical="end"
            horizontal="center"
            className="mr-2 bg-black text-white"
            onClick={() => setVisible(false)}
          >
            <Tooltip message={user?.email} position="left">
              <Avatar
                className="z-50 cursor-pointer rounded-full ring-2 ring-accent"
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
          <a
            href="/api/auth/login?returnTo=/member/account"
            className="btn-ghost btn"
          >
            Member Login
          </a>
        )}
      </Navbar>
    </header>
  );
}

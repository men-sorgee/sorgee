import Link from 'next/link';
import { Navbar, Dropdown, Avatar, Button, Menu, Tooltip } from 'react-daisyui'
import 'react';
import { Logo } from 'components/icons';
import { useAppUser } from '../../lib/hooks/use-member'

export default function Header({ path }: { path: string}) {
  const { user, member } = useAppUser();
  return (
    <header className=" sticky top-0 z-40 transition-all duration-150 bg-black ">

      <Navbar
        className="bg-black max-w-6xl mx-auto px-4"
      >

        <div className='flex-1'>
          <a href="/" >
            <Logo width="50" height="50" className='mr-3 h-6 sm:h-9 cursor-pointer'/>
          </a>
          <span className="self-center whitespace-nowrap text-xl font-semibold text-secondary">
            GuysNHeat
          </span>
        </div>
        { !user &&
        <div className="flex-none">
          <Menu horizontal className="p-0">
            <Menu.Item>
              <Link href="/api/auth/login">Login</Link>
            </Menu.Item>
          </Menu>
        </div>}

        { user && 
        
          <Dropdown
            vertical='end'
            className="bg-black text-gray-500 mr-2"
          >
            <Button color="ghost">
              <Tooltip
                color='ghost'
                message={user?.email}
                position='left'>
                <Avatar shape='circle' size={40} letters={member?.first_name[0]||'X'} src={member?.picture || user?.picture}  />
              </Tooltip>
            </Button>
              
            <Dropdown.Menu>
              { member?.application_status == 'approved' &&
              <>
              <Dropdown.Item href="/member/profile">
                Profile
              </Dropdown.Item>
              <Dropdown.Item href="/member/invite">
                Invite
              </Dropdown.Item>
              </>}
              <Dropdown.Item href="/api/auth/logout">
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>}
      </Navbar>
    </header>
  );
}

import { useState } from 'react';
import { Drawer, Menu } from 'react-daisyui';
import { useMetaContext } from 'lib/hooks';
import { Props } from 'models';
import Header from './Header';
import { useMember } from 'lib/hooks/use-member';
import Meta from '../meta';
import Footer from './Footer';
import Link from 'next/link';

export default function Layout({ children }: Props) {
  const { user, member } = useMember();
  const { path, pages } = useMetaContext();
  const [visible, setVisible] = useState(false);
  const toggleDrawer = () => {
    setVisible(!visible);
  };
  return (
    <>
      <Meta />
      <Header
        {...{
          user,
          member,
          toggleDrawer,
          visible,
          setVisible
        }}
      />
      <Drawer
        open={visible}
        onClickOverlay={toggleDrawer}
        className=""
        side={
          <Menu
            vertical
            className="sticky w-fit overflow-y-auto bg-black p-4 text-white"
          >
            <Menu.Item className={`my-2 ${path === '/' && 'active'}`}>
              <Link href="/">
                <a
                  className={`btn block text-center no-underline ${
                    path === '/' ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  Home
                </a>
              </Link>
            </Menu.Item>
            {pages?.map((page, i) => (
              <Menu.Item
                key={i}
                className={`my-2 ${path === page.path && 'active'}`}
              >
                <Link href={page.path}>
                  <a
                    className={`btn block text-center no-underline ${
                      path === page.path ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    {page.title}
                  </a>
                </Link>
              </Menu.Item>
            ))}

            <Menu.Item className={`my-2 ${path === '/privacy' && 'active'}`}>
              <Link href="/privacy">
                <a
                  className={`btn-sm btn block text-center no-underline ${
                    path === '/privacy' ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  Privacy Policy
                </a>
              </Link>
            </Menu.Item>

            <Menu.Item className={`my-2 ${path === '/terms' && 'active'}`}>
              <Link href="/terms">
                <a
                  className={`btn-sm btn block text-center ${
                    path === '/terms' ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  Terms of Service
                </a>
              </Link>
            </Menu.Item>
          </Menu>
        }
      >
        <div className="container">
          <main>{children}</main>
          <Footer />
        </div>
      </Drawer>
    </>
  );
}

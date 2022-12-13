import { useState } from 'react';
import { Drawer, Menu, Link } from 'react-daisyui';
import { useMetaContext } from 'lib/hooks';
import { Props } from 'models';
import Header from './Header';
import { useMember } from 'lib/hooks/use-member';
import Meta from '../meta';
import Footer from './Footer';

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
        className="static z-10 !min-h-fit !overflow-hidden"
        side={
          <Menu
            vertical
            className="w-fit overflow-y-auto bg-black p-4 text-white"
          >
            <Menu.Item className={`my-2 ${path === '/' && 'active'}`}>
              <Link
                href="/"
                className={`btn block text-center no-underline ${
                  path === '/' ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                Home
              </Link>
            </Menu.Item>
            {pages?.map((page, i) => (
              <Menu.Item
                key={i}
                className={`my-2 ${path === page.path && 'active'}`}
              >
                <Link
                  href={page.path}
                  className={`btn block text-center no-underline ${
                    path === page.path ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  {page.title}
                </Link>
              </Menu.Item>
            ))}
            <hr />
            <Menu.Item className={`my-2 ${path === '/privacy' && 'active'}`}>
              <Link
                href="/privacy"
                className={`btn block text-center no-underline ${
                  path === '/privacy' ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                Privacy Policy
              </Link>
            </Menu.Item>

            <Menu.Item className={`my-2 ${path === '/terms' && 'active'}`}>
              <Link
                href="/terms"
                className={`btn block text-center no-underline ${
                  path === '/terms' ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                Terms of Service
              </Link>
            </Menu.Item>
          </Menu>
        }
      >
        <main>
          <article>{children}</article>
          <Footer />
        </main>
      </Drawer>
    </>
  );
}

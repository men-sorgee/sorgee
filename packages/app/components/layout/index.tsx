import Meta from '../meta';
import Header from './Header';
import Footer from './Footer';
import 'react';
import { useMetaContext } from '@/lib/hooks/use-meta-context';
import { Props } from 'lib/types';
import { useAppUser } from '../../lib/hooks/use-member';
import { Drawer, Link, Menu, Navbar } from 'react-daisyui';
import { useState } from 'react';

export default function Layout({ children }: Props) {
  const { user, member } = useAppUser();
  const { path, pages } = useMetaContext();
  const [visible, setVisible] = useState(false);
  const toggleDrawer = () => {
    setVisible(!visible);
  };
  return (
    <>
      <Meta />
      <Header {...{ user, member, toggleDrawer, visible, setVisible }} />
      <Drawer
        open={visible}
        onClickOverlay={toggleDrawer}
        className="sticky top-0 z-10"
        side={
          <Menu
            vertical
            className="w-80 overflow-y-auto bg-black p-4 text-white"
          >
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

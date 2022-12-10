import { useState } from 'react';
import { Drawer, Menu, Link, Footer } from 'react-daisyui';
import { useMetaContext } from 'lib/hooks';
import { Props } from 'models';
import Header from './Header';
import { useMember } from 'lib/hooks/use-member';
import Meta from '../meta';

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
          setVisible,
          hasPages: pages?.length > 0
        }}
      />
      <Drawer
        open={visible}
        onClickOverlay={toggleDrawer}
        className="static z-10"
        side={
          <Menu
            vertical
            className="w-fit overflow-y-auto bg-black p-4 text-white"
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

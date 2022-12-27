import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'react-daisyui';
import { useMetaContext } from 'lib/hooks/use-meta-context';
import { listActivePages } from '../../lib/services/directus/static';
import { PageItem } from '../../lib/models';

export default function Layout() {
  const [pages, setPages] = useState<PageItem[]>();

  useEffect(
    () => {
      listActivePages().then((pages) => {
        setPages(
          pages
            .filter((p) => p.in_menu)
            .map((p) => {
              return { title: p.title, path: `/${p.slug}` };
            })
        );
      });
    },
    setPages,
    pages
  );
  const { path } = useMetaContext();

  return (
    <>
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
    </>
  );
}

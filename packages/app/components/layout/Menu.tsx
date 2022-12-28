import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useMetaContext } from 'lib/hooks'
import { listActivePages } from 'lib/services/directus/static'
import { PageItem } from 'lib/models'
import { Menu } from 'react-daisyui'

function AppMenu(_props: any) {
  const [pages, setPages] = useState<PageItem[]>()
  const { path } = useMetaContext()

  useEffect(() => {
    if (!pages) {
      listActivePages().then((pages) => {
        setPages(
          pages
            .filter((p) => p.in_menu)
            .map((p) => {
              return { title: p.title, path: `/${p.slug}` }
            })
        )
      })
    }
  }, [setPages, pages])

  return (
    <Menu vertical className=" sticky w-fit overflow-y-auto bg-black p-4 text-white">
      <Menu.Item className={` my-2 ${path === '/' && 'active'}`}>
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
        <Menu.Item key={i} className={`my-2 ${path === page.path && 'active'}`}>
          <a
            href={page.path}
            className={`btn block text-center no-underline ${
              path === page.path ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            {page.title}
          </a>
        </Menu.Item>
      ))}

      <Menu.Item className={`my-2 ${path === '/privacy' && 'active'}`}>
        <Link
          href="/privacy"
          className={`block text-center no-underline ${
            path === '/privacy' ? 'btn-primary' : 'btn-ghost'
          }`}
        >
          Privacy Policy
        </Link>
      </Menu.Item>

      <Menu.Item className={`my-2 ${path === '/terms' && 'active'}`}>
        <Link
          href="/terms"
          className={`block text-center ${path === '/terms' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Terms of Service
        </Link>
      </Menu.Item>
    </Menu>
  )
}

export default AppMenu

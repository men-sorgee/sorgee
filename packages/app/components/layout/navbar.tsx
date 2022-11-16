import Link from 'next/link';
import 'react';
import Logo from 'components/ui/Logo';
import { useUser } from '@auth0/nextjs-auth0';
import { tw } from 'twind';
import _styles from '_styles';

export default function Navbar() {
  const { user } = useUser();
  const { link: linkStyles, h1site: h1Classes } = _styles;
  return (
    <header
      className={tw`sticky top-0 bg-black z-40 transition-all duration-150`}
    >
      <a href="#skip" className={tw`sr-only focus:not-sr-only`}>
        Skip to content
      </a>
      <nav className={tw`mx-auto max-w-6xl px-6`}>
        <div
          className={tw`flex justify-between align-middle flex-row py-4 md:py-6 relative`}
        >
          <div
            className={tw`flex flex-1 align-middle items-center text-purple`}
          >
            <Link href="/">
              <a
                className={tw` cursor-pointer rounded-full transform duration-100 ease-in-out`}
                aria-label="Logo"
              >
                <Logo width="50" height="50" />
              </a>
            </Link>
            <h1 className={h1Classes}>Guys N Heat</h1>
          </div>

          <div className={tw`flex flex-1 justify-end space-x-8 hidden`}>
            <Link href="/learn">
              <a className={linkStyles}>Learn</a>
            </Link>
            <Link href="/about">
              <a className={linkStyles}>About</a>
            </Link>
            {user && (
              <>
                <Link href="/apply">
                  <a className={linkStyles}>Application</a>
                </Link>

                <Link href="/api/auth/logout">
                  <a className={linkStyles}>Logout</a>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

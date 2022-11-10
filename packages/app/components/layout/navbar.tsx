import Link from 'next/link';
import 'react';
import Logo from 'components/icons/Logo';
import { useUser } from '@auth0/nextjs-auth0';
import { tw } from 'twind';

export default function Navbar() {
  const { user } = useUser();
  const linkStyles = tw`inline-flex items-center leading-6 font-medium transition ease-in-out duration-75 cursor-pointer text-gray-200 rounded-md p-1 focus:(outline-none text-gray-100 ring-2 hover:text-gray-100`;
  return (
    <nav className={tw`sticky top-0 bg-black z-40 transition-all duration-150`}>
      <a href="#skip" className={tw`sr-only focus:not-sr-only`}>
        Skip to content
      </a>
      <div className={tw`mx-auto max-w-6xl px-6`}>
        <div
          className={tw`flex justify-between align-middle flex-row py-4 md:py-6 relative`}
        >
          <div className={tw`flex flex-1 items-center`}>
            <Link href="/">
              <a
                className={tw` cursor-pointer rounded-full transform duration-100 ease-in-out`}
                aria-label="Logo"
              >
                <Logo width="50" height="50" />
              </a>
            </Link>
            <h1 className={tw`font-extrabold text-4xl p-1 m-1 ml-2 text-purple-500`}>Guys N Heat</h1>
            
          </div>

          <div className={tw`flex flex-1 justify-end space-x-8 hidden`}>
            {user ? (
              <>
                <Link href="/profile">
                  <a className={linkStyles}>Account</a>
                </Link>
                <Link href="/api/auth/logout">
                  <a className={linkStyles}>Logout</a>
                </Link>
              </>
            ) : (
              <>
                <Link href="/api/auth/login">
                  <a className={linkStyles}>Login</a>
                </Link>
                <Link href="/api/auth/login">
                  <a className={linkStyles}>Apply</a>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

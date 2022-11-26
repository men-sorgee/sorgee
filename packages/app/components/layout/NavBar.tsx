import Link from 'next/link';
import 'react';
import { Logo, Photo } from 'components/ui';
import { useUser } from '@auth0/nextjs-auth0';
import { tw } from 'twind';
import styles from 'styles';

export default function Navbar() {
  const { user } = useUser();

  return (
    <header
      className={tw`sticky top-0 bg-black z-40 transition-all duration-150`}
    >
      <a href="#skip" className={tw`sr-only focus:not-sr-only`}>
        Skip to content
      </a>
      <nav className={tw`mx-auto max-w-6xl px-6`}>
        <div
          className={tw`flex justify-between align-middle flex-row relative`}
        >
          <div
            className={tw`flex align-middle items-center text-center text-purple`}
          >
            <Link href="/">
              <a
                className={tw` cursor-pointer rounded-full transform duration-100 ease-in-out`}
                aria-label="Logo"
              >
                <Logo width="50" height="50" />
              </a>
            </Link>
            <h1 className={tw`${styles.h1site} ml-4`}>Guys N Heat</h1>
          </div>

          <div
            className={tw`flex flex-1 justify-end align-middle space-x-8 items-center`}
          >
            <Link href="/learn">
              <a className={tw`${styles.headLink} !hidden`}>Learn</a>
            </Link>
            <Link href="/about">
              <a className={tw`${styles.headLink} !hidden`}>About</a>
            </Link>
            {user && (
              <>
                <Link href="/apply">
                  <a className={tw`${styles.headLink} !hidden`}>Apply Now</a>
                </Link>

                <Link href="/api/auth/logout">
                  <a className={tw`${styles.headLink}`}>Logout</a>
                </Link>
                {user?.picture && (
                  <div className="w-10 h-10 ">
                    <img
                      className=" ring-2 ring-gray-300 p-1 rounded-full border-2 border-white"
                      src={user.picture!}
                      alt={user.name!}
                      width={50}
                      height={50}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

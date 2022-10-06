import Link from 'next/link';
import Logo from 'components/icons/Logo';
import { useUser } from 'lib/hooks/useUser';
import { tw } from 'twind';

const Navbar = () => {
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
                <Logo width="24px" height="24px" />
              </a>
            </Link>
            <nav className={tw`space-x-2 ml-6 `}>
              <Link href="/learn">
                <a className={linkStyles}>Learn More</a>
              </Link>
              <Link href="/pricing">
                <a className={linkStyles}>Pricing</a>
              </Link>
            </nav>
          </div>

          <div className={tw`flex flex-1 justify-end space-x-8`}>
            {user ? (
              <>
                <Link href="/account">
                  <a className={linkStyles}>Account</a>
                </Link>
                <Link href="/api/auth/logout">
                  <a className={linkStyles}>Sign out</a>
                </Link>
              </>
            ) : (
              <Link href="/sign-in">
                <a className={linkStyles}>Sign in</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

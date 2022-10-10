import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { tw } from 'twind';

export default function Footer() {
  return (
    <footer className={tw`w-full px-6 bg-gray-900`}>
      <div
        className={tw`mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-gray-600 py-12 text-white transition-colors duration-150 bg-gray-900`}
      >
        <div className={tw`col-span-1 lg:col-span-2`}>
          <Link href="/">
            <a
              className={tw`flex flex-initial items-center font-bold md:mr-24`}
            >
              <span className={tw`rounded-full border border-gray-700 mr-2`}>
                <Logo />
              </span>
              <span>Guys-N-Heat</span>
            </a>
          </Link>
        </div>
        <div className={tw`col-span-1 lg:col-span-2`}>
          <ul className={tw`flex flex-initial flex-col md:flex-1`}>
            <li className={tw`py-3 md:py-0 md:pb-4`}>
              <Link href="/">
                <a
                  className={tw`text-white hover:text-gray-200 transition ease-in-out duration-150`}
                >
                  Home
                </a>
              </Link>
            </li>
            <li className={tw`py-3 md:py-0 md:pb-4`}>
              <Link href="/">
                <a
                  className={tw`text-white hover:text-gray-200 transition ease-in-out duration-150`}
                >
                  About
                </a>
              </Link>
            </li>
            <li className={tw`py-3 md:py-0 md:pb-4`}>
              <Link href="/">
                <a
                  className={tw`text-white hover:text-gray-200 transition ease-in-out duration-150`}
                >
                  Careers
                </a>
              </Link>
            </li>
            <li className={tw`py-3 md:py-0 md:pb-4`}>
              <Link href="/">
                <a
                  className={tw`text-white hover:text-gray-200 transition ease-in-out duration-150`}
                >
                  Blog
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={tw`col-span-1 lg:col-span-2`}>
          <ul className={tw`flex flex-initial flex-col md:flex-1`}>
            <li className={tw`py-3 md:py-0 md:pb-4`}>
              <p
                className={tw`text-white font-bold hover:text-gray-200 transition ease-in-out duration-150`}
              >
                LEGAL
              </p>
            </li>
            <li className={tw`py-3 md:py-0 md:pb-4`}>
              <Link href="/">
                <a
                  className={tw`text-white hover:text-gray-200 transition ease-in-out duration-150`}
                >
                  Privacy Policy
                </a>
              </Link>
            </li>
            <li className={tw`py-3 md:py-0 md:pb-4`}>
              <Link href="/">
                <a
                  className={tw`text-white hover:text-gray-200 transition ease-in-out duration-150`}
                >
                  Terms of Use
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={tw`py-12 flex flex-col md:flex-row justify-between items-center space-y-4 bg-gray-900`}
      >
        <div>
          <span>&copy; 2020 ACME, Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

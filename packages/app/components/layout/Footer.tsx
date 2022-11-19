import Link from 'next/link';
import Logo from 'components/ui/Logo';
import { tw } from 'twind';
import { DiscordIcon, GitHubIcon, InstagramIcon, TwitterIcon } from '../icons';

export default function Footer() {
  return (
    <footer className={tw`w-full `}>
      <div
        className={tw`flex flex-col items-center justify-between w-full py-12 text-xs leading-none text-gray-500 lg:flex-row`}
      >
        <div
          className={tw`flex self-start flex-grow-0 flex-shrink-0 w-full leading-none lg:w-auto`}
        >
          <span
            className={tw`inline-flex justify-center w-full mt-4 space-x-5 sm:ml-auto sm:mt-0`}
          >
            <a
              href="https://www.instagram.com/guysnheat/"
              target={'_blank'}
              rel="noreferrer"
              className={tw`text-gray-400 hover:text-gray-200`}
            >
              <span className={tw`sr-only`}>Instagram</span>
              <InstagramIcon className={tw`w-6 h-6`} />
            </a>

            <a
              href="https://twitter.com/guysnheat"
              target={'_blank'}
              rel="noreferrer"
              className={tw`text-gray-400 hover:text-gray-200`}
            >
              <span className={tw`sr-only`}>Twitter</span>
              <TwitterIcon className={tw`w-6 h-6`} />
            </a>

            <a
              href="https://discord.gg/DmMPhMXEE6"
              target={'_blank'}
              rel="noreferrer"
              className={tw`text-gray-400 hover:text-gray-200`}
            >
              <span className={tw`sr-only`}>Discord</span>
              <DiscordIcon className={tw`w-6 h-6`} />
            </a>
          </span>
        </div>
        <ul
          className={tw`flex my-6 text-sm text-gray-500 list-none lg:flex-grow-0 lg:flex-shrink-0 lg:my-0`}
        >
          <li className={tw`box-border block font-semibold text-left`}>
            <a
              href="/terms"
              className={tw`pr-5 mr-5 text-gray-500 no-underline  border-r border-gray-700 cursor-pointer`}
            >
              Terms of service
            </a>
          </li>
          <li className={tw`box-border block font-semibold text-left`}>
            <a
              href="/privacy"
              className={tw`pr-5 mr-5 text-gray-500 no-underline  cursor-pointer`}
            >
              Privacy policy
            </a>
          </li>
        </ul>

        <h5>&copy; Guys N Heat 2022. All rights reserved.</h5>
      </div>
    </footer>
  );
}

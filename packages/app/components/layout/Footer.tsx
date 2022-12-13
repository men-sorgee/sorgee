import { DiscordIcon, InstagramIcon, TwitterIcon } from '../icons';

export default function Footer() {
  return (
    <footer className="w-full px-4">
      <div className="flex w-full flex-col items-center justify-between py-6 text-xs leading-none text-gray-500 lg:flex-row">
        <div className="flex w-full flex-shrink-0 flex-grow-0 self-start leading-none lg:w-auto">
          <span className="mt-4 inline-flex w-full justify-center space-x-5 sm:ml-auto sm:mt-0">
            <a
              href="https://www.instagram.com/guysnheat/"
              target={'_blank'}
              rel="noreferrer"
              className="text-gray-200 hover:text-gray-100"
            >
              <span className="sr-only">Instagram</span>
              <InstagramIcon className="h-6 w-6" />
            </a>

            <a
              href="https://twitter.com/guysnheat"
              target={'_blank'}
              rel="noreferrer"
              className="text-gray-200 hover:text-gray-100"
            >
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-6 w-6" />
            </a>

            <a
              href="https://discord.gg/zMbwypyKgD"
              target={'_blank'}
              rel="noreferrer"
              className="text-gray-200 hover:text-gray-100"
            >
              <span className="sr-only">Discord</span>
              <DiscordIcon className="h-6 w-6" />
            </a>
          </span>
        </div>
        <ul className="my-3 flex list-none text-sm text-gray-500 lg:my-0 lg:flex-shrink-0 lg:flex-grow-0">
          <li className="box-border block text-left font-semibold">
            <a
              href="/terms"
              className="mr-5 cursor-pointer border-r border-gray-700  pr-5 text-gray-500 no-underline hover:text-gray-200"
            >
              Terms of service
            </a>
          </li>
          <li className="box-border block text-left font-semibold">
            <a
              href="/privacy"
              className="mr-5 cursor-pointer pr-5 text-gray-500 no-underline  hover:text-gray-200"
            >
              Privacy policy
            </a>
          </li>
        </ul>

        <div>&copy; Guys N Heat 2022. All rights reserved.</div>
      </div>
    </footer>
  );
}

import { ReactNode } from 'react';
import { tw } from 'twind';

export type InfoProps = {
  title: string;
};

export default function Info({
  children
}: {
  children: ReactNode | ReactNode[];
}) {
  return (
    <>
      <button
        type="button"
        data-tooltip-target="tooltip-dark"
        data-tooltip-style="dark"
        className={tw`ml-1`}
      >
        <svg
          aria-hidden="true"
          className={tw`w-4 h-4 text-gray-400 hover:text-gray-500 dark:hover:text-white`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className={tw`sr-only`}>Show information</span>
      </button>
      <div
        id="tooltip-dark"
        role="tooltip"
        className={tw`absolute z-10 invisible inline-block max-w-sm px-3 py-2 text-xs font-normal text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700`}
      >
        {children}
        <div className={'tooltip-arrow'} data-popper-arrow></div>
      </div>
    </>
  );
}

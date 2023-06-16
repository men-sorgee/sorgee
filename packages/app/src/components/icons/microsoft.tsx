import type { NextComponentType, NextPageContext } from 'next'

interface Props {}

const Microsoft: NextComponentType<NextPageContext, {}, Props> = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Microsoft"
      role="img"
      viewBox="0 0 512 512"
      width="64px"
      height="64px"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_iconCarrier">
        <rect width="512" height="512" rx="15%" fill="#ffffff"></rect>
        <path d="M75 75v171h171v-171z" fill="#f25022"></path>
        <path d="M266 75v171h171v-171z" fill="#7fba00"></path>
        <path d="M75 266v171h171v-171z" fill="#00a4ef"></path>
        <path d="M266 266v171h171v-171z" fill="#ffb900"></path>
      </g>
    </svg>
  )
}

export default Microsoft

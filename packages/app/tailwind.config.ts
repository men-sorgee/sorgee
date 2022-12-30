import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'
import { Config } from 'tailwindcss'
import { brand } from './theme'

const config: Config = {
  content: [
    './pages/**/*.tsx',
    './components/**/*.tsx',
    './node_modules/daisyui/dist/**/*.js',
    './node_modules/react-daisyui/dist/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/daisyui/dist/**/*.js',
    '../../node_modules/react-daisyui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  base: {},
  theme: {
    ...defaultTheme,
    extend: {
      screens: {
        standalone: { raw: '(display-mode:standalone)' },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--font-roboto)', ...defaultTheme.fontFamily.serif],
        mono: ['Consolas', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        ...brand.colors,
        slate: colors.slate,
        info: colors.sky,
        success: colors.emerald,
        warning: colors.amber,
        error: colors.red,
      },
    },
  },
  // @ts-ignore
  //plugins: [require('@tailwindcss/typography'), require('daisyui')],
  //daisyui: {
  //  styled: true,
  //  base: true,
  //  utils: true,
  //  logs: false,
  //  rtl: false,
  //  prefix: '',
  //  darkTheme: false,
  //  themes: [
  //    {
  //      dark: {
  //        // @ts-ignore
  //        ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
  //        primary: brand.colors.primary.DEFAULT,
  //        secondary: brand.colors.secondary.DEFAULT,
  //        accent: brand.colors.accent.DEFAULT,
  //        neutral: brand.colors.gray.DEFAULT,
  //        content: brand.colors.gray['50'],
  //        'base-100': brand.colors.gray['400'],
  //        'primary-focus': brand.colors.primary.DEFAULT,
  //      },
  //    },
  //  ],
  //},
}

export default config

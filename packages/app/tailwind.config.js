const defaultTheme = require( 'tailwindcss/defaultTheme' )
const colors = require( 'tailwindcss/colors' )
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.tsx',
    './components/**/*.tsx',
    './node_modules/daisyui/dist/**/*.js',
    './node_modules/react-daisyui/dist/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/daisyui/dist/**/*.js',
    '../../node_modules/react-daisyui/dist/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    //...defaultTheme,
    extend: {
      screens: {
        standalone: { raw: '(display-mode:standalone)' }
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        serif: ['Roboto Slab', ...defaultTheme.fontFamily.serif],
        mono: ['Consolas', ...defaultTheme.fontFamily.mono]
      },
      colors: {
        dark: '#000b22',
        accent: {
          DEFAULT: '#9B4F96',
          '50': '#f5edf5',
          '100': '#ebdcea',
          '200': '#d7b9d5',
          '300': '#c395c0',
          '400': '#af72ab',
          '500': '#9b4f96',
          '600': '#7c3f78',
          '700': '#5d2f5a',
          '800': '#3e203c',
          '900': '#1f101e'
        },
        primary: {
          DEFAULT: '#0038A8',
          '50': '#e6ebf6',
          '100': '#ccd7ee',
          '200': '#99afdc',
          '300': '#6688cb',
          '400': '#3360b9',
          '500': '#0038a8',
          '600': '#002d86',
          '700': '#002265',
          '800': '#001643',
          '900': '#000b22'
        },
        secondary: {
          DEFAULT: '#D60270',
          '50': '#fbe6f1',
          '100': '#f7cce2',
          '200': '#ef9ac6',
          '300': '#e667a9',
          '400': '#de358d',
          '500': '#d60270',
          '600': '#ab025a',
          '700': '#800143',
          '800': '#56012d',
          '900': '#2b0016'
        },
        slate: colors.slate,
        info: colors.sky,
        success: colors.emerald,
        warning: colors.amber,
        error: colors.red,
      }
    }
  },
  plugins: [require( '@tailwindcss/typography' ), require( 'daisyui' )],
  daisyui: {
    styled: true,
    themes: true,
    base: false,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: false,
  }
}


module.exports = config

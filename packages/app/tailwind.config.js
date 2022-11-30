const defaultTheme = require( 'tailwindcss/defaultTheme' )
const colors = require( 'tailwindcss/colors' )
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.tsx',
    './components/**/*.tsx',
    '../../node_modules/daisyui/dist/**/*.js',
    '../../node_modules/react-daisyui/dist/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    ...defaultTheme,
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
        ...colors,
        primary: {
          DEFAULT: '#7C3AED',
          '50': '#ECE2FC',
          '100': '#DFD0FB',
          '200': '#C7AAF7',
          '300': '#AE85F4',
          '400': '#955FF0',
          '500': '#7C3AED',
          '600': '#5D14DB',
          '700': '#470FA7',
          '800': '#320B74',
          '900': '#1C0641'
        },
        secondary: {
          DEFAULT: '#70C030',
          '50': '#D1EEBA',
          '100': '#C6EAAA',
          '200': '#B0E189',
          '300': '#9BD968',
          '400': '#85D148',
          '500': '#70C030',
          '600': '#569325',
          '700': '#3C661A',
          '800': '#21390E',
          '900': '#070C03'
        }
      }
    }
  },
  plugins: [require( '@tailwindcss/typography' ), require( 'daisyui' ), require( 'flowbite/plugin' )],
  daisyui: {
    styled: true,
    themes: true,
    base: false,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: false,
  },
}

module.exports = config

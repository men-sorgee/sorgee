const defaultTheme = require( 'tailwindcss/defaultTheme' )
const colors = require( 'tailwindcss/colors' )
const YAML = require( 'yamljs' )
const path = require( 'path' )
const brandColors = YAML.load( path.resolve( __dirname, './brand.yaml' ) ).colors
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
  base: {

  },
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
        ...brandColors,
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
    themes: false,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "",
    darkTheme: false,
    themes: [{
      dark: {
        ...require( "daisyui/src/colors/themes" )["[data-theme=dark]"],
        primary: brandColors.primary.DEFAULT,
        secondary: brandColors.secondary.DEFAULT,
        accent: brandColors.accent.DEFAULT,
        neutral: brandColors.dark,
        content: "#FFFFFF",
        "base-100": "#000b22",
        "primary-focus": brandColors.primary.DEFAULT
      },
    }],
  }
}


module.exports = config

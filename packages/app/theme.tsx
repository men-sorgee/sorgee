import { ChakraTheme, extendTheme } from '@chakra-ui/react'
import { default as defaultTheme } from '@chakra-ui/theme'
import { StepsStyleConfig as Steps } from 'chakra-ui-steps'
import { Manrope, Roboto_Slab, Roboto_Mono } from '@next/font/google'

const heading = Roboto_Slab({
  variable: '--font-roboto-slab',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

const body = Manrope({
  variable: '--font-manrope',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
})

const mono = Roboto_Mono({
  variable: '--font-roboto-mono',
  fallback: ['Consolas', 'Menlo', 'monospace'],
})

export const brand = {
  colors: {
    gray: {
      DEFAULT: '#333c4e',
      50: '#e6e7e9',
      100: '#ccced3',
      200: '#999da7',
      300: '#666d7a',
      400: '#333c4e',
      500: '#000b22',
      600: '#00091b',
      700: '#000714',
      800: '#00040e',
      900: '#000207',
    },
    primary: {
      DEFAULT: '#0038A8',
      50: '#e6ebf6',
      100: '#ccd7ee',
      200: '#99afdc',
      300: '#6688cb',
      400: '#3360b9',
      500: '#0038a8',
      600: '#002d86',
      700: '#002265',
      800: '#001643',
      900: '#000b22',
    },
    secondary: {
      DEFAULT: '#9B4F96',
      50: '#f5edf5',
      100: '#ebdcea',
      200: '#d7b9d5',
      300: '#c395c0',
      400: '#af72ab',
      500: '#9b4f96',
      600: '#7c3f78',
      700: '#5d2f5a',
      800: '#3e203c',
      900: '#1f101e',
    },
    accent: {
      DEFAULT: '#D60270',
      50: '#fbe6f1',
      100: '#f7cce2',
      200: '#ef9ac6',
      300: '#e667a9',
      400: '#de358d',
      500: '#d60270',
      600: '#ab025a',
      700: '#800143',
      800: '#56012d',
      900: '#2b0016',
    },
  },
  logo: 'https://static.guysnheat.com/static/logo.png',
}
const { colors } = defaultTheme
const custom: Partial<ChakraTheme> = {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  components: {
    Steps,
    Input: {
      variants: {
        outlined: {
          field: {
            border: '2px solid',
            borderColor: 'gray.500',
            bg: 'transparent',
            // Let's also provide dark mode alternatives
            _dark: {
              borderColor: 'white',
              color: 'white',
              bg: 'transparent',
            },
          },
          addon: {
            border: '2px solid',
            borderColor: 'gray.200',
            color: 'gray.500',
            _dark: {
              borderColor: 'white',
              color: 'white',
            },
          },
        },
      },
    },
  },
  fonts: {
    body: body.style.fontFamily,
    heading: body.style.fontFamily,
    mono: mono.style.fontFamily,
  },
  colors: {
    ...brand.colors,
  },
  textStyles: {
    heading: {
      marginTop: 4,
      marginBottom: 2,
    },
    body: {
      marginTop: 4,
      marginBottom: 2,
    },
    mono: {},
  },
  semanticTokens: {
    colors: {
      text: {
        default: 'gray.900',
        _dark: 'white',
      },
      bg: {
        default: 'gray.50',
        _dark: 'gray.900',
      },
      error: {
        default: 'red.300',
        _dark: 'red.500',
      },
      success: {
        default: 'green.200',
        _dark: 'green.300',
      },
      primary: {
        default: 'primary.500',
        _dark: 'primary.500',
      },
      secondary: {
        default: 'secondary.500',
        _dark: 'secondary.500',
      },
    },
  },
  styles: {
    global: {
      'header a:any-link': {
        color: 'white',
      },
      'a:any-link': {
        color: 'text',
      },
      'a:hover,a.active': {
        color: 'accent.300',
        _dark: {
          color: 'accent.500',
        },
      },
      h1: {
        fontSize: '4xl',
        fontWeight: 'extrabold',
        bgGradient: 'linear(to-r, pink.500, blue.500)',
        bgClip: 'text',
        mt: 4,
      },
      h2: {
        fontSize: 'xl',
        fontWeight: 'bold',
        color: 'primary.500',
        my: 3,
      },
      h3: {
        fontSize: 'xl',
        fontWeight: 'semibold',
        color: 'secondary.500',
      },
      h4: {
        fontSize: 'lg',
        fontWeight: 'bold',
        color: 'accent.500',
      },
      h5: {
        fontSize: 'lg',
        fontWeight: 'semibold',
        lineHeight: '110%',
        my: 1,
      },
      ul: {
        my: 2,
      },
      p: {
        my: 2,
      },

      '.gradient': {
        p: 4,
        bgGradient: 'linear(to-br, primary.400, black)',
        color: 'white',
        borderRadius: '5px',
      },
      '.gradient a:any-link': {
        color: 'white',
        textDecoration: 'underline',
      },
      '.gradient input': {
        _placeholder: {
          color: 'gray.300',
        },
      },
    },
  },
}

export const theme = extendTheme(custom) as ChakraTheme

export default brand

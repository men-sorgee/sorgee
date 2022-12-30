import { ChakraTheme, extendTheme, createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { baseTheme } from '@chakra-ui/theme'
import { StepsStyleConfig as Steps } from 'chakra-ui-steps'
import { Manrope, Roboto_Slab, Roboto_Mono } from '@next/font/google'
import { inputAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys
)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  field: {
    border: '1px solid',
    borderColor: 'gray.200',
    bg: 'gray.500',
    borderRadius: '5px',
    fontFamily: 'mono', // change the font family
    color: 'white', // change the input text color
  },
})

export const inputTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    size: 'md',
    variant: 'filled',
  },
})

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
const { colors, components } = baseTheme
const custom: Partial<ChakraTheme> = {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  components: {
    ...components,
    Steps,
    Input: inputTheme,
  },
  fonts: {
    body: body.style.fontFamily,
    heading: heading.style.fontFamily,
    mono: mono.style.fontFamily,
  },
  colors: {
    ...brand.colors,
    dark: brand.colors.gray[900],
    info: colors.blue[300],
    success: colors.green[300],
    warning: colors.yellow[400],
    error: colors.red[500],
  },
  textStyles: {},
  layerStyles: {
    base: {
      bg: 'bg',
      border: '2px solid',
      borderColor: 'gray.500',
    },
    selected: {
      bg: 'accent.500',
      color: 'white',
    },
  },
  semanticTokens: {
    colors: {
      text: {
        default: 'gray.900',
        _dark: 'gray.50',
      },
      bg: {
        default: 'gray.50',
        _dark: 'gray.900',
      },
      error: 'red.500',
      success: 'green.500',
      primary: 'primary.500',
      secondary: 'red.800',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        fontSize: 'sm',
        color: 'text',
        bg: 'bg',
        lineHeight: 'tall',
      },
      a: {
        color: props.colorMode === 'dark' ? 'teal.300' : 'teal.500',
      },
      h1: {
        // you can also use responsive styles
        fontSize: ['48px', '72px'],
        fontFamily: 'heading',
        fontWeight: 'bold',
        lineHeight: '110%',
        letterSpacing: '-2%',
        bgGradient: 'linear(to-r, pink.500, blue.500)',
        bgClip: 'text',
        my: 4,
      },
      h2: {
        fontSize: '48px',
        fontWeight: 'semibold',
        lineHeight: '110%',
        letterSpacing: '-1%',
        color: 'primary.500',
        my: 3,
      },
      h3: {
        fontSize: '36px',
        fontWeight: 'semibold',
        lineHeight: '110%',
        letterSpacing: '-1%',
        color: 'secondary.500',
        my: 2,
      },
      h4: {
        fontSize: ['36px', '48px'],
        fontWeight: 'semibold',
        lineHeight: '110%',
        letterSpacing: '-1%',
        color: 'accent.500',
        my: 1,
      },
      h5: {
        fontSize: ['36px', '48px'],
        fontWeight: 'bold',
        lineHeight: '110%',
        my: 1,
      },
      ul: {
        my: 2,
      },
      p: {
        my: 2,
      },
      ':root': `{
        ${heading.variable}
        ${body.variable}
        ${mono.variable}
      }`,
      '.gradient': {
        p: 4,
        bgGradient: 'linear(to-br, primary.400, black)',
        text: 'white',
        borderRadius: '5px',
      },
    }),
  },
}

export const theme = extendTheme(custom) as ChakraTheme

export default brand

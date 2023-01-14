import { ChakraTheme, extendTheme } from '@chakra-ui/react'
import { default as defaultTheme } from '@chakra-ui/theme'
import { StepsStyleConfig } from 'chakra-ui-steps'
import { radioAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  radioAnatomy.keys
)

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
const custom: Partial<ChakraTheme> = {
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  components: {
    Radio: {
      baseStyle: {
        // define the part you're going to style
        control: {
          borderRadius: '12px', // change the border radius
          borderColor: 'accent.500', // change the border color
        },
      },
    },
    Steps: {
      ...StepsStyleConfig,
      baseStyle: (props) => {
        return {
          ...StepsStyleConfig.baseStyle(props),
          iconLabel: {
            ...StepsStyleConfig.baseStyle(props).iconLabel,
            color: 'white',
          },
        }
      },
    },
    Input: {
      baseStyle: {
        field: {
          padding: '0 .5rem',
          _placeholder: {
            color: 'gray.50',
          },
        },
      },
      variants: {
        outlined: {
          field: {
            border: '2px solid',
            borderColor: 'gray.500',

            //bg: 'transparent',
            // Let's also provide dark mode alternatives
            _dark: {
              borderColor: 'white',
              color: 'white',
              //bg: 'transparent',
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
  colors: {
    ...brand.colors,
  },
  textStyles: {
    heading: {
      baseStyle: {
        fontWeight: '900',
        fontSpacing: '0.05em',
      },
      variants: {},
    },
    body: {},
    mono: {},
  },
  semanticTokens: {
    colors: {
      text: {
        default: 'gray.700',
        _dark: 'white',
      },
      bg: {
        default: 'gray.50',
        _dark: 'gray.500',
      },
      error: {
        default: 'red.500',
        _dark: 'red.300',
      },
      success: {
        default: 'green.200',
        _dark: 'green.300',
      },
      primary: {
        default: 'primary.500',
        _dark: 'primary.700',
      },
      secondary: {
        default: 'secondary.500',
        _dark: 'secondary.700',
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        fontFamily: 'body',
        color: 'text',
        bg: 'bg',
      },
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
        fontSize: ['2xl', '4xl'],
        lineHeight: ['2rem', '4rem', '6rem'],
        fontWeight: 'extrabold',
        bgGradient: 'linear(to-r, pink.500, blue.500)',
        bgClip: 'text',

        my: 2,
        overflow: 'visible',
      },
      h2: {
        fontSize: ['xl', '2xl'],
        lineHeight: ['1rem', '2rem'],
        fontWeight: 'bold',
        color: 'primary.500',
        width: 'fit-content',
        mx: 'auto',
        _dark: {
          color: 'primary.300',
        },
        my: 3,
      },
      h3: {
        fontSize: ['lg', 'xl'],
        fontWeight: 'extrabold',
        color: 'secondary.500',

        _dark: {
          color: 'secondary.200',
        },
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
        margin: '0 auto',
        width: 'fit-content',
        listStylePosition: 'inside',
        padding: '0',
      },
      li: { textAlign: 'left' },
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
          color: 'gray.50',
        },
      },
    },
  },
}

export const theme = extendTheme(custom) as ChakraTheme

export default brand

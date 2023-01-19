import { ChakraTheme, extendTheme, StyleFunctionProps } from '@chakra-ui/react'
import { default as defaultTheme } from '@chakra-ui/theme'
import { mode } from '@chakra-ui/theme-tools'
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
    Heading: {
      ...defaultTheme.components.Heading,
      baseStyle: {},
      variants: {},
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
        default: 'primary.700',
        _dark: 'primary.500',
      },
      secondary: {
        default: 'secondary.500',
        _dark: 'secondary.700',
      },
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => {
      return {
        body: {
          fontFamily: 'body',
          color: 'text',
          bg: 'bg',
        },
        header: {
          a: {
            color: 'gray.100',
            fontWeight: 'bold',
            _hover: {
              color: 'white',
            },
          },
        },
        a: {
          color: mode('primary.500', 'accent.300')(props),
          _hover: {
            color: mode('accent.500', 'accent.300')(props),
          },
        },
        h1: {
          fontSize: ['4xl', '5xl', '6xl'],
          lineHeight: ['3rem', '4rem', '6rem'],
          fontWeight: 'extrabold',
          leading: 'tight',
          bgGradient: 'linear(to-r, pink.500, blue.500)',
          bgClip: 'text',
          my: 2,
          overflow: 'visible',
        },
        h2: {
          fontSize: ['3xl', '4xl'],
          lineHeight: ['1rem', '2rem'],
          fontWeight: 'bold',
          color: mode('primary.500', 'primary.300')(props),
          //width: 'fit-content',
          //mx: 'auto',
          my: 3,
        },
        h3: {
          fontSize: ['2xl', '3xl'],
          fontWeight: 'extrabold',
          color: mode('secondary.500', 'secondary.200')(props),
        },
        h4: {
          fontSize: ['xl', '2xl'],
          fontWeight: 'bold',
          color: 'accent.500',
        },
        h5: {
          fontSize: 'md',
          fontWeight: 'semibold',
          lineHeight: '110%',
          color: mode('primary.400', 'primary.200')(props),
          my: 1,
        },
        h6: {
          fontSize: 'md',
          lineHeight: '110%',
          color: mode('primary.400', 'primary.200')(props),
          my: 1,
        },
        ul: {
          //margin: '0 auto',
          //width: 'fit-content',
          listStylePosition: 'inside',
          padding: '0',
        },
        li: { textAlign: 'left' },
        p: {
          my: 2,
        },
      }
    },
  },
}

export const theme = extendTheme(custom) as ChakraTheme

export default brand

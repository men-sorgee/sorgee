import { ChakraTheme, extendTheme, StyleFunctionProps } from '@chakra-ui/react'
import { default as defaultTheme } from '@chakra-ui/theme'
import { mode } from '@chakra-ui/theme-tools'
import { StepsStyleConfig } from 'chakra-ui-steps'
import { brand } from 'lib/config/brand'

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
      defaultProps: {
        size: 'lg',
        variant: 'outline',
        colorScheme: 'ghost',
      },
      baseStyle: {
        field: {
          _placeholder: {
            color: 'gray.50',
          },
        },
      },
    },
    Select: {
      defaultProps: {
        size: 'lg',
        variant: 'outline',
        colorScheme: 'ghost',
      },
    },
    Checkbox: {
      defaultProps: {
        size: 'lg',
        variant: 'outline',
        colorScheme: 'primary',
      },
    },
    Switch: {
      defaultProps: {
        size: 'lg',
        variant: 'outline',
        colorScheme: 'accent',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'lg',
        variant: 'outline',
        colorScheme: 'ghost',
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
        default: 'gray.100',
        _dark: 'gray.400',
      },
      error: {
        default: 'red.500',
        _dark: 'red.300',
      },
      success: {
        default: 'green.200',
        _dark: 'green.300',
      },
      info: {
        default: 'primary.700',
        _dark: 'primary.500',
      },
      primary: {
        default: 'primary.700',
        _dark: 'primary.500',
      },
      secondary: {
        default: 'secondary.800',
        _dark: 'secondary.700',
      },
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => {
      const bg = mode(defaultTheme.colors.gray['200'], defaultTheme.colors.gray['700'])(props)
      const fg = brand.colors.accent['500']
      return {
        body: {
          fontFamily: 'body',
          color: 'text',
          backgroundColor: bg,
        },
        '*': {
          scrollbarWidth: 'auto',
          scrollbarColor: `${bg} ${fg};`,
        },
        '*::-webkit-scrollbar': {
          width: '16px',
        },
        '*::-webkit-scrollbar-track': {
          background: bg,
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: fg,
          borderRadius: '10px',
          border: `3px solid ${bg}`,
        },
        header: {
          a: {
            color: 'gray.100',
            _hover: {
              color: 'white',
            },
          },
          'a.active': {
            fontWeight: 'bold',
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
          leading: 'loose',
          fontFamily: 'heading',
          bgGradient: 'linear(to-r, pink.400, blue.400)',
          bgClip: 'text',
          mt: 2,
          overflow: 'visible',
          textShadow: 'lg',
          textStyles: '2px solid primary.500',
        },
        h2: {
          fontSize: ['3xl', '4xl'],
          lineHeight: ['1rem', '2rem'],
          fontWeight: 'bold',
          color: mode('primary.500', 'primary.300')(props),
          //width: 'fit-content',
          //mx: 'auto',
          mt: 3,
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

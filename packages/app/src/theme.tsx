import { brand } from "lib/config/brand";

import { defineStyleConfig, StyleFunctionProps } from "@chakra-ui/react";
import { baseTheme as defaultTheme } from "@chakra-ui/theme";
import { mode } from "@chakra-ui/theme-tools";

export default function getTheme(body: any, heading: any, mono: any) {
  return {
    fonts: {
      body: body.style.fontFamily,
      heading: heading.style.fontFamily,
      mono: mono.style.fontFamily
    },
    config: {
      initialColorMode: 'system',
      useSystemColorMode: true
    },
    components: {
      Heading: defineStyleConfig({
        baseStyle: {},
        variants: {},
        defaultProps: {}
      }),
      Radio: {
        baseStyle: {
          // define the part you're going to style
          control: {
            borderRadius: '12px', // change the border radius
            borderColor: 'accent.500' // change the border color
          }
        }
      },
      Input: {
        defaultProps: {
          size: 'lg',
          variant: 'outline',
          colorScheme: 'ghost'
        },
        baseStyle: {
          field: {
            _placeholder: {
              color: 'gray.50'
            }
          }
        }
      },
      Select: {
        defaultProps: {
          size: 'lg',
          variant: 'outline',
          colorScheme: 'ghost'
        }
      },
      Checkbox: {
        defaultProps: {
          size: 'lg',
          variant: 'outline',
          colorScheme: 'primary'
        }
      },
      Switch: {
        defaultProps: {
          size: 'lg',
          variant: 'outline',
          colorScheme: 'accent'
        }
      },
      NumberInput: {
        defaultProps: {
          size: 'lg',
          variant: 'outline',
          colorScheme: 'ghost'
        }
      },
      Stats: {
        defaultProps: {
          colorScheme: 'primary'
        }
      }
    },
    colors: {
      ...brand.colors
    },
    textStyles: {
      h1: {
        fontSize: ['4xl', '5xl', '6xl']
      },
      h2: {
        fontSize: ['3xl', '4xl']
      },
      h3: {
        fontSize: ['2xl', '3xl']
      },
      h4: {
        fontSize: ['xl', '2xl']
      },
      h5: {
        fontSize: 'md'
      },
      h6: {
        fontSize: 'md'
      },
      heading: {
        ...heading.style
      },
      body: {
        ...body.style
      },
      mono: {
        ...mono.style
      }
    },
    semanticTokens: {
      colors: {
        text: {
          default: 'gray.700',
          _dark: 'white'
        },
        bg: {
          default: 'gray.100',
          _dark: 'gray.400'
        },
        error: {
          default: 'red.500',
          _dark: 'red.300'
        },
        success: {
          default: 'green.200',
          _dark: 'green.300'
        },
        info: {
          default: 'primary.700',
          _dark: 'primary.500'
        },
        primary: {
          default: 'primary.700',
          _dark: 'primary.500'
        },
        secondary: {
          default: 'secondary.800',
          _dark: 'secondary.700'
        }
      }
    },
    styles: {
      global: (props: StyleFunctionProps) => {
        const bg = mode(
          defaultTheme.colors.gray['200'],
          defaultTheme.colors.gray['700']
        )(props)
        const fg = mode('black', defaultTheme.colors.gray['200'])
        return {
          body: {
            fontFamily: 'body',
            color: 'text',
            backgroundColor: bg
          },
          '*': {
            scrollbarWidth: 'auto',
            scrollbarColor: `${bg} ${fg};`
          },
          '*::-webkit-scrollbar': {
            width: '16px'
          },
          '*::-webkit-scrollbar-track': {
            background: bg
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: fg,
            borderRadius: '10px',
            border: `3px solid ${bg}`
          },
          header: {
            a: {
              color: 'gray.100',
              _hover: {
                color: 'white'
              }
            },
            'a.active': {
              fontWeight: 'bold'
            }
          },
          a: {
            color: mode('primary.500', 'accent.300')(props),
            _hover: {
              color: mode('accent.500', 'accent.300')(props)
            }
          },
          h1: {
            textStyle: 'h1',
            fontWeight: 'extrabold',
            leading: 'loose',
            fontFamily: 'heading',
            bgGradient: 'linear(to-r, accent.400, blue.400)',
            bgClip: 'text',
            mt: '2rem',
            overflow: 'visible'
          },
          h2: {
            textStyle: 'h2',
            fontWeight: 'bold',
            leading: 'loose',
            fontFamily: 'heading',
            color: mode('primary.500', 'primary.300')(props),
            mt: '2rem'
          },
          h3: {
            textStyle: 'h3',
            fontWeight: 'extrabold',
            leading: 'loose',
            fontFamily: 'heading',
            color: mode('secondary.500', 'secondary.200')(props),
            mt: '1.75rem'
          },
          h4: {
            textStyle: 'h4',
            fontWeight: 'bold',
            leading: 'loose',
            fontFamily: 'heading',
            color: 'accent.500',
            mt: '1.5rem'
          },
          h5: {
            textStyle: 'h5',
            fontWeight: 'semibold',
            leading: 'loose',
            fontFamily: 'heading',
            color: mode('primary.400', 'primary.200')(props),
            mt: '1.25rem'
          },
          h6: {
            textStyle: 'h6',
            fontWeight: 'semibold',
            leading: 'loose',
            fontFamily: 'heading',
            color: mode('primary.400', 'primary.200')(props),
            mt: '1rem'
          },
          ul: {
            margin: '0 auto',

            listStylePosition: 'inside',
            padding: '0'
          },
          li: { textAlign: 'left' },
          p: {
            mt: 2
          },
          '.print-only': {
            display: 'none'
          },
          //'.cody-launcher': {
          //  bottom: null,
          //  top: '48%',
          //  zIndex: '10!important'
          //},
          '@media print': {
            '.print-only': {
              display: 'inherit'
            },
            '.no-print': {
              display: 'none'
            },
            'header, footer': {
              display: 'none!important'
            }
          }
        }
      }
    }
  }
}

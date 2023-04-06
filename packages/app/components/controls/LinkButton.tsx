import NextLink from 'next/link'
import { Link, Button, ButtonProps, chakra } from '@chakra-ui/react'

type Props = ButtonProps & {
  href: string
  gradient?: boolean
  colorScheme?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'gray'
  children: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => void
}

export const LinkButton = chakra(
  ({ href, gradient = true, colorScheme = 'secondary', children, onClick, ...styles }: Props) => {
    return (
      <Link as={NextLink} href={href} onClick={onClick} _hover={{ textDecoration: 'none' }}>
        <Button
          colorScheme={colorScheme}
          bgGradient={
            gradient && `linear(to-b, ${colorScheme}.400, ${colorScheme}.500, ${colorScheme}.600)`
          }
          bg={gradient ? undefined : `${colorScheme}.400`}
          _hover={{ bg: `${colorScheme}.600` }}
          variant="solid"
          color="white"
          {...styles}
        >
          {children}
        </Button>
      </Link>
    )
  }
)

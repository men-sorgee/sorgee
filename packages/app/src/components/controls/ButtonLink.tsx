import NextLink from 'next/link'

import { Link, Button, ButtonProps, chakra } from '@chakra-ui/react'

type Props = ButtonProps & {
  href: string
  gradient?: boolean
  children: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => void
  replace?: boolean
}

export const ButtonLink = chakra(
  ({
    href,
    gradient = false,
    colorScheme = 'secondary',
    children,
    onClick,
    replace = true,
    w,
    flex,
    ...props
  }: Props) => {
    const bgGradient = `linear(to-b, ${colorScheme}.400, ${colorScheme}.500, ${colorScheme}.600)`
    const bgGradientHover = `linear(to-b, ${colorScheme}.300, ${colorScheme}.400, ${colorScheme}.500)`
    return (
      <Link
        as={NextLink}
        href={href}
        onClick={onClick}
        style={{ color: 'white', textDecoration: 'none' }}
        replace={replace}
        w={w}
        flex={flex}
        display="block"
      >
        <Button
          bgGradient={gradient ? bgGradient : 'none'}
          bg={gradient ? null : `${colorScheme}.500`}
          color="white"
          _hover={{
            bgGradient: gradient ? bgGradientHover : 'none',
            bg: gradient ? null : `${colorScheme}.400`
          }}
          {...props}
        >
          {children}
        </Button>
      </Link>
    )
  }
)

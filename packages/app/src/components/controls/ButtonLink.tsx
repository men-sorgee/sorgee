import NextLink from 'next/link'

import { Link, Button, ButtonProps, chakra } from '@chakra-ui/react'

type Props = ButtonProps & {
  href: string
  gradient?: boolean
  children: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => void
  replace?: boolean
  prefetch?: boolean
}

export const ButtonLink = chakra(
  ({
    href,
    gradient = false,
    colorScheme = 'secondary',
    children,
    onClick,
    replace = true,
    prefetch = true,
    w,
    flex,
    ...props
  }: Props) => {
    const bgGradient = `linear(to-b, ${colorScheme}.400, ${colorScheme}.500, ${colorScheme}.600)`
    return (
      <Link
        as={NextLink}
        href={href}
        onClick={onClick}
        style={{ color: 'white', textDecoration: 'none' }}
        replace={replace}
        prefetch={prefetch}
        w={w}
        flex={flex}
        display="block"
      >
        <Button
          bgGradient={gradient ? bgGradient : 'none'}
          bg={gradient ? null : `${colorScheme}.500`}
          {...props}
        >
          {children}
        </Button>
      </Link>
    )
  }
)

import NextLink from 'next/link'

import { Button, ButtonProps, chakra } from '@chakra-ui/react'

type Props = ButtonProps & {
  href: string
  gradient?: boolean
  children: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => void
}

export const ButtonLink = chakra(
  ({
    href,
    gradient = false,
    colorScheme = 'secondary',
    children,
    onClick,
    ...props
  }: Props) => {
    const bgGradient = `linear(to-b, ${colorScheme}.400, ${colorScheme}.500, ${colorScheme}.600)`
    return (
      <NextLink
        href={href}
        onClick={onClick}
        style={{ color: 'white', textDecoration: 'none' }}
      >
        <Button
          bgGradient={gradient ? bgGradient : 'none'}
          bg={gradient ? null : `${colorScheme}.500`}
          {...props}
        >
          {children}
        </Button>
      </NextLink>
    )
  }
)

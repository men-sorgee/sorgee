import NextLink from 'next/link'
import { Link, Button, ButtonProps, chakra } from '@chakra-ui/react'

type Props = ButtonProps & {
  href: string
  gradient?: boolean
  children: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => void
}

export const ButtonLink = ({
  href,
  colorScheme = 'secondary',
  children,
  onClick,
  ...props
}: Props) => {
  const bgGradient = `linear(to-b, ${colorScheme}.400, ${colorScheme}.500, ${colorScheme}.600)`
  return (
    <NextLink href={href} onClick={onClick} style={{ color: 'white', textDecoration: 'none' }}>
      <Button bgGradient={bgGradient} {...props}>
        {children}
      </Button>
    </NextLink>
  )
}

import NextLink from 'next/link'
import { Link, Button, ButtonProps, chakra } from '@chakra-ui/react'

interface Props extends ButtonProps {
  href: string
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'grey'
  children: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => void
}

export const LinkButton = chakra(
  ({ href, color = 'secondary', children, onClick, ...styles }: Props) => {
    return (
      <Link as={NextLink} href={href} onClick={onClick} _hover={{ textDecoration: 'none' }}>
        <Button
          colorScheme={color}
          bgGradient={`linear(to-b, ${color}.400, ${color}.500, ${color}.600)`}
          _hover={{ bg: `${color}.600` }}
          color="white"
          variant="solid"
          {...styles}
        >
          {children}
        </Button>
      </Link>
    )
  }
)

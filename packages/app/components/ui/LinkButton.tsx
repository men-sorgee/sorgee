import NextLink from 'next/link'
import { Link, Button, ButtonProps, chakra } from '@chakra-ui/react'

interface Props extends ButtonProps {
  href: string
  children: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => void
}

const LinkButton = ({ href, children, onClick, ...styles }: Props) => {
  return (
    <Link as={NextLink} href={href} onClick={onClick}>
      <Button {...styles}>{children}</Button>
    </Link>
  )
}

export default chakra(LinkButton)

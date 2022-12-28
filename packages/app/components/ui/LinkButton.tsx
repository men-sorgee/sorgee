import Link from 'next/link'
import { Button } from 'react-daisyui'

interface Props {
  href: string
  className?: string
  children: React.ReactNode | React.ReactNode[]
  color?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'info' | 'success' | 'warning' | 'error'
  onClick?: (e: any) => void
}

const LinkButton = ({ href, children, className, color, onClick }: Props) => {
  return (
    <Link href={href} onClick={onClick}>
      <Button color={color} className={className}>
        {children}
      </Button>
    </Link>
  )
}

export default LinkButton

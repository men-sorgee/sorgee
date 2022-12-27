import Link from 'next/link';
import { Button } from 'react-daisyui';

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  color?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ghost'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  onClick?: () => void;
}

const LinkButton = ({ href, children, className, color, onClick }: Props) => {
  return (
    <Link href={href}>
      <a onClick={onClick}>
        <Button color={color} className={className}>
          {children}
        </Button>
      </a>
    </Link>
  );
};

export default LinkButton;

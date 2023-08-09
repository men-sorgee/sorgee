import { gradient } from "lib/utils";
import NextLink from "next/link";

import { Button, ButtonProps, chakra, Link } from "@chakra-ui/react";

type Props = ButtonProps & {
  href: string
  children: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => void
  replace?: boolean
}

export const ButtonLink = chakra(
  ({
    href,
    children,
    colorScheme = 'primary',
    onClick = () => {},
    replace = false,
    w = ['full', 'auto'],
    flex = 'auto',
    ...props
  }: Props) => {
    const bgGradient = gradient(colorScheme)
    const bgGradientHover = gradient(colorScheme, 100)
    return (
      <Link
        as={NextLink}
        href={href}
        w={w}
        display="block"
        onClick={(e) => {
          onClick(e)
          return true
        }}
      >
        <Button
          variant="solid"
          colorScheme={colorScheme}
          bgGradient={bgGradient}
          color="white"
          _hover={{
            bgGradient: bgGradientHover,
          }}
          w={w}
          {...props}
        >
          {children}
        </Button>
      </Link>
    )
  }
)

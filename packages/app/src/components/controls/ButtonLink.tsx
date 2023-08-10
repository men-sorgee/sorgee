import { gradient } from "lib/utils";
import NextLink from "next/link";

import {
  Button,
  chakra,
  IconButton,
  IconButtonProps,
  Link
} from "@chakra-ui/react";

export type ButtonLinkProps = IconButtonProps & {
  href: string
  children?: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => boolean
  replace?: boolean
}

export const ButtonLink = chakra(
  ({
    href,
    children,
    colorScheme = 'primary',
    onClick,
    replace = false,
    w = ['full', 'auto'],
    flex = 'auto',
    color = 'white',
    icon,
    title,
    ...props
  }: ButtonLinkProps) => {
    const bgGradient = gradient(colorScheme)
    const bgGradientHover = gradient(colorScheme, 100)
    return (
      <Link
        as={NextLink}
        href={href}
        w={w}
        display="block"
        onClick={(e) => {
          if (onClick) return onClick(e)
          return true
        }}
      >
        {(icon && (
          <IconButton
            aria-label={title}
            title={title}
            icon={icon}
            colorScheme={colorScheme}
            bgGradient={bgGradient}
            color={color}
            _hover={{
              bgGradient: bgGradientHover,
            }}
            {...props}
          />
        )) || (
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
        )}
      </Link>
    )
  }
)

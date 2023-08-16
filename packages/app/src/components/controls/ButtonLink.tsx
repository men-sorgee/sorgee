import { gradient } from "lib/utils";
import NextLink from "next/link";

import {
  Button,
  chakra,
  IconButton,
  IconButtonProps,
  Link
} from "@chakra-ui/react";

export type ButtonLinkProps = Omit<IconButtonProps, 'aria-label'> & {
  href: string
  children?: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => boolean
  replace?: boolean
}

export const ButtonLink = chakra(
  ({
    href,
    children,
    as,
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
        as={as || NextLink}
        href={href}
        w={w}
        display="block"
        flex={flex}
        onClick={(e) => {
          if (onClick) return onClick(e)
          return true
        }}
        replace={replace}
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
            w={w}
            {...props}
          />
        )) || (
            <Button
              variant="solid"
              colorScheme={colorScheme}
              bgGradient={bgGradient}
              color={color}
              title={title}

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

import { gradient } from "lib/utils";
import { memo } from "react";

import {
  Button,
  chakra,
  IconButton,
  IconButtonProps,
  LinkBox,
  LinkOverlay
} from "@chakra-ui/react";

export type ButtonLinkProps = Omit<IconButtonProps, 'aria-label'> & {
  href: string
  children?: React.ReactNode | React.ReactNode[]
  onClick?: (e: any) => boolean
  replace?: boolean
}

export const ButtonLink = memo(chakra(
  function ButtonLink({
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
  }: ButtonLinkProps) {
    const bgGradient = gradient(colorScheme)
    const bgGradientHover = gradient(colorScheme, 100)
    return (
      <LinkBox
        w={w}
        flex={flex}
        onClick={(e) => {
          if (onClick) return onClick(e)
          return true
        }}

      >
        <LinkOverlay href={href} >
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
                w='full'
                {...props}
              >
                {children}
              </Button>
            )}
        </LinkOverlay>
      </LinkBox>
    )
  }
))

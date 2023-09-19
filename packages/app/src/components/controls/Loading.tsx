import React, { memo } from "react";

import {
  chakra,
  Spinner,
  SpinnerProps,
  Square,
  SquareProps
} from "@chakra-ui/react";

export type LoadingProps = SpinnerProps &
  SquareProps & {
    children?: React.ReactNode | React.ReactNode[]
  }

export const Loading = memo(chakra(
  function Loading({ size = 'lg', thickness = '25px', centerContent = true, children, ...props }: LoadingProps) {
    return (
      <Square centerContent={centerContent} {...props}>
        <Spinner color="accent.500" emptyColor="gray.200" thickness="6px" size={size} />
      </Square>

    )
  }
))

import {
  chakra,
  Spinner,
  SpinnerProps,
  Square,
  SquareProps
} from '@chakra-ui/react'

type Props = SpinnerProps &
  SquareProps & {
    children?: React.ReactNode | React.ReactNode[]
  }

export const Loading = chakra(
  ({
    size = 'lg',
    thickness = '25px',
    centerContent = true,
    children,
    ...props
  }: Props) => {
    return (
      <>
        <Square centerContent={centerContent} p={10}>
          <Spinner
            color="accent.500"
            emptyColor="gray.200"
            thickness="6px"
            size={size}
          />
        </Square>
      </>
    )
  }
)

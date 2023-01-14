import { Square, SquareProps, chakra, Spinner, SpinnerProps, Heading } from '@chakra-ui/react'

type Props = SpinnerProps &
  SquareProps & {
    children?: React.ReactNode | React.ReactNode[]
  }

const Loading = ({
  size = 'lg',
  thickness = '25px',
  centerContent = true,
  children,
  ...props
}: Props) => {
  return (
    <>
      <Square centerContent={centerContent}>
        <Spinner
          maxW="20%"
          color="accent.500"
          emptyColor="gray.200"
          thickness="6px"
          size={size}
          {...props}
        />
      </Square>
    </>
  )
}
export default chakra(Loading)

import { Square, SquareProps, chakra, VStack, Spinner, SpinnerProps } from '@chakra-ui/react'

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
      <Square centerContent={centerContent} mx={'auto'}>
        <VStack spacing={4} mt={40}>
          <Spinner
            color="accent.500"
            emptyColor="gray.200"
            thickness="6px"
            size={size}
            {...props}
          />
          {children}
        </VStack>
      </Square>
    </>
  )
}
export default chakra(Loading)

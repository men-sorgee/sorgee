import {
  Square,
  SquareProps,
  chakra,
  HStack,
  Spinner,
  SpinnerProps,
  StyleProps,
} from '@chakra-ui/react'

type Props = SpinnerProps &
  SquareProps & {
    children?: React.ReactNode | React.ReactNode[]
  }

const Loading = ({ size = 'lg', centerContent = true, children, ...props }: Props) => {
  return (
    <>
      <Square size={size} centerContent={centerContent} {...props} mx={'auto'}>
        <HStack>
          <Spinner {...props} />
          {children}
        </HStack>
      </Square>
    </>
  )
}
export default chakra(Loading)

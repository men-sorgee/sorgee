import { useFormContext } from 'react-hook-form'
import { ReactNode, useState } from 'react'
import {
  FormHelperText,
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Flex,
  chakra,
  Fade,
} from '@chakra-ui/react'
import { InfoIcon } from '../icons'

type Props = FormControlProps & {
  field?: string
  label?: string
  help?: string
  align?: 'left' | 'right | center'
  children: ReactNode | ReactNode[]
}

const FieldWrapper = (props: Props) => {
  const [showHelp, setShowHelp] = useState(false)
  const { field, label, help, className, children, size, align = 'left', w, ...opts } = props
  const { getFieldState } = useFormContext()
  const { error, isDirty } = getFieldState(field)
  return (
    <FormControl
      w={w}
      size={size}
      align={align}
      isInvalid={!!error}
      {...opts}
      onMouseOver={() => setShowHelp(true)}
      onMouseOut={() => setShowHelp(false)}
      position="relative"
    >
      {label && (
        <FormLabel size={size} fontWeight="bold" htmlFor={field}>
          {label}
        </FormLabel>
      )}
      {children}
      {showHelp && help && (
        <Fade in={showHelp}>
          <FormHelperText
            as={Flex}
            cursor={'help'}
            position="absolute"
            zIndex="popover"
            bg="black"
            color="white"
            p={2}
            borderRadius="md"
            shadow={'lg'}
          >
            <InfoIcon color="primary" mr={2} /> {help}
          </FormHelperText>
        </Fade>
      )}
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export default chakra(FieldWrapper)

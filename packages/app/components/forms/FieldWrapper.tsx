import { useFormContext } from 'react-hook-form'
import { ReactNode } from 'react'
import {
  FormHelperText,
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Flex,
  chakra,
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
  const { field, label, help, className, children, size, align = 'left', w, ...opts } = props
  const { getFieldState } = useFormContext()
  const { error, isDirty } = getFieldState(field)
  return (
    <FormControl w={w} size={size} align={align} isInvalid={!!error} {...opts}>
      {label && (
        <FormLabel size={size} fontWeight="bold" htmlFor={field}>
          {label}
        </FormLabel>
      )}
      {children}
      {!isDirty && help && (
        <FormHelperText as={Flex} cursor={'help'}>
          <InfoIcon color="primary" mr={2} /> {help}
        </FormHelperText>
      )}
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export default chakra(FieldWrapper)

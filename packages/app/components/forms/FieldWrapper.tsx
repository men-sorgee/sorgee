import { useFormContext } from 'react-hook-form'
import { ReactNode } from 'react'
import {
  FormHelperText,
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  chakra,
  HStack,
  StyleProps,
} from '@chakra-ui/react'
import { InfoIcon } from '../icons'
type Props = FormControlProps & {
  field?: string
  label?: string
  help?: string
  className?: string
  children: ReactNode | ReactNode[]
}

const FieldWrapper = (props: Props) => {
  const { field, label, help, className, children, ...opts } = props
  const { getFieldState } = useFormContext()
  const { error, isDirty } = getFieldState(field)
  return (
    <FormControl isInvalid={!!error} textAlign="left" className={className} {...opts} py={2}>
      {label && (
        <FormLabel fontWeight="bold" htmlFor={field}>
          {label}
        </FormLabel>
      )}
      {children}
      {!isDirty && help && <FormHelperText cursor={'help'}>{help}</FormHelperText>}
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

export default chakra(FieldWrapper)

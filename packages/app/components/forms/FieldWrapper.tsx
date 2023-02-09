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
  align?: 'left' | 'right | center'
  children: ReactNode | ReactNode[]
}

const FieldWrapper = (props: Props) => {
  const { field, label, help, className, children, size, align = 'left', w, p = 2, ...opts } = props
  const { getFieldState } = useFormContext()
  const { error, isDirty } = getFieldState(field)
  return (
    <FormControl w={w} size={size} align={align} isInvalid={!!error} {...opts} p={p}>
      {label && (
        <FormLabel size={size} fontWeight="bold" htmlFor={field}>
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

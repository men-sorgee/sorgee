import { useFormContext } from 'react-hook-form'
import { ReactNode, createRef } from 'react'
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Tooltip,
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
  const { error } = getFieldState(field)
  const InfoTip = () => (
    <Tooltip hasArrow label={help} aria-label="A tooltip">
      <InfoIcon title={help} cursor={'help'} />
    </Tooltip>
  )
  return (
    <FormControl isInvalid={!!error} className={className} {...opts}>
      <HStack spacing={0}>
        {label && <FormLabel htmlFor={field}>{label}</FormLabel>}
        {help && <InfoTip />}
      </HStack>
      {children}

      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  )
}

export default chakra(FieldWrapper)

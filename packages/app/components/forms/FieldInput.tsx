import { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import { Input, InputProps, chakra } from '@chakra-ui/react'

export type Props = InputProps &
  InputHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    registerOptions?: RegisterOptions
    className?: string
  }

const InputField = (props: Props) => {
  const { field, label, help, registerOptions = {}, className, ...opts } = props
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''

  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <Input
        {...opts}
        className={classes}
        id={field}
        {...register(field as any, registerOptions)}
      />
    </FieldWrapper>
  )
}
export default chakra(InputField)

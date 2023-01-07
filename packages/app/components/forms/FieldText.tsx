import { chakra } from '@chakra-ui/react'
import { TextareaHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import { Textarea, TextareaProps } from '@chakra-ui/react'
type Props = TextareaProps &
  TextareaHTMLAttributes<HTMLInputElement> & {
    field: string
    label: string
    help?: string
    registerOptions?: RegisterOptions
    className?: string
  }

const TextField = (props: Props) => {
  const { field, label, help, registerOptions = {}, className, ...opts } = props
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''
  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <Textarea
        {...opts}
        id={field}
        {...register(field as any, registerOptions)}
        className={classes}
      />
    </FieldWrapper>
  )
}

export default chakra(TextField)

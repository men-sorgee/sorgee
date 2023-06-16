import { TextareaHTMLAttributes } from 'react'

import { RegisterOptions, useFormContext } from 'react-hook-form'

import { chakra, Textarea, TextareaProps } from '@chakra-ui/react'

import FieldWrapper from './FieldWrapper'

type Props = TextareaProps &
  TextareaHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    registerOptions?: RegisterOptions
    className?: string
  }

const TextField = (props: Props) => {
  const { field, label, help, registerOptions = {}, className, mt, ...opts } = props
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''
  return (
    <FieldWrapper field={field} label={label} help={help} className={className} mt={mt}>
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

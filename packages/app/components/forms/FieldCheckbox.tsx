import React, { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import { chakra, Checkbox, CheckboxProps } from '@chakra-ui/react'

type Props = CheckboxProps &
  InputHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    registerOptions?: RegisterOptions
    className?: string
    children?: React.ReactNode | React.ReactNode[]
  }

const CheckboxField = (props: Props) => {
  const { field, label, help, registerOptions = {}, children, className, ...opts } = props
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''

  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <Checkbox {...opts} {...register(field, registerOptions)}>
        {children || label}
      </Checkbox>
    </FieldWrapper>
  )
}

export default chakra(CheckboxField)

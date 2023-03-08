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
  const { register, watch } = useFormContext()
  const checked = watch(field)?.toString() === 'true'
  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <Checkbox checked={checked} {...opts} {...register(field, registerOptions)}>
        {children || 'Yes'}
      </Checkbox>
    </FieldWrapper>
  )
}

export default chakra(CheckboxField)

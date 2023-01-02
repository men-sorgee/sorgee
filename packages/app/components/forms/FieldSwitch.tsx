import React, { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import { chakra, Switch, SwitchProps, Text } from '@chakra-ui/react'

type Props = SwitchProps &
  InputHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    registerOptions?: RegisterOptions
    className?: string
    children?: React.ReactNode | React.ReactNode[]
  }

const SwitchField = (props: Props) => {
  const { field, label, help, registerOptions = {}, children, className, ...opts } = props
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''

  return (
    <FieldWrapper field={field} className={className}>
      <Switch {...opts} {...register(field, registerOptions)} {...opts} className={classes}>
        <span style={{ fontWeight: 'bold' }}>{label}</span>
      </Switch>
      {help && <Text fontSize={'xs'}>{help}</Text>}
      {children}
    </FieldWrapper>
  )
}

export default chakra(SwitchField)

import React, { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import { chakra, HStack, Switch, SwitchProps, Text } from '@chakra-ui/react'

type Props = SwitchProps & {
  field: string
  label?: string
  help?: string
  size?: 'sm' | 'md' | 'lg'
  registerOptions?: RegisterOptions
  children?: React.ReactNode | React.ReactNode[]
}

const SwitchField = (props: Props) => {
  const { field, label, help, registerOptions = {}, children, className, size, ...opts } = props
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''

  return (
    <FieldWrapper size={size} field={field} className={className}>
      <HStack>
        <Switch
          textAlign="left"
          id={field}
          size={size}
          {...opts}
          {...register(field, registerOptions)}
          className={classes}
        />
        <Text as="label" htmlFor={field} size={size} style={{ fontWeight: 'bold' }}>
          {label}
        </Text>
      </HStack>
      {help && <Text fontSize={'xs'}>{help}</Text>}
      {children}
    </FieldWrapper>
  )
}

export default chakra(SwitchField)

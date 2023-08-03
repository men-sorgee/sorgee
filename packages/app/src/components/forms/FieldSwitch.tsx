import React from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";

import { chakra, HStack, Switch, SwitchProps, Text } from "@chakra-ui/react";

import FieldWrapper from "./FieldWrapper";

type Props = SwitchProps & {
  field: string
  label?: string
  help?: string
  size?: 'sm' | 'md' | 'lg'
  registerOptions?: RegisterOptions
  children?: React.ReactNode | React.ReactNode[]
}

const SwitchField = (props: Props) => {
  const {
    field,
    label,
    help,
    registerOptions = {},
    children,
    className,
    size,
    mt,
    mb,
    mr,
    ml,
    my,
    mx,
    ...opts
  } = props
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''

  return (
    <FieldWrapper
      size={size}
      field={field}
      className={className}
      {...{ mt, mb, mr, ml, my, mx }}
    >
      <HStack>
        <Switch
          textAlign="left"
          id={field}
          size={size}
          {...opts}
          {...register(field, registerOptions)}
          className={classes}
        />
        <Text
          as="label"
          htmlFor={field}
          size={size}
          style={{ fontWeight: 'bold', cursor: 'pointer' }}
        >
          {label}
        </Text>
      </HStack>
      {help && <Text fontSize={'xs'}>{help}</Text>}
      {children}
    </FieldWrapper>
  )
}

export default chakra(SwitchField)

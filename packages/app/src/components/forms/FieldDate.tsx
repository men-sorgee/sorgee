import { InputHTMLAttributes } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";

import { chakra, Input, InputProps } from "@chakra-ui/react";

import FieldWrapper from "./FieldWrapper";

type Props = InputProps &
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
        isInvalid={!!error}
        {...opts}
        id={field}
        {...register(field as any, registerOptions)}
        type="date"
        className={classes}
      />
    </FieldWrapper>
  )
}
export default chakra(InputField)

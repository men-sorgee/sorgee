import { InputHTMLAttributes } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";

import { chakra, Input, InputProps, useColorModeValue } from "@chakra-ui/react";

import FieldWrapper from "./FieldWrapper";

export type Props = InputProps &
  InputHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    registerOptions?: RegisterOptions
    className?: string
  }

const InputField = (props: Props) => {
  const {
    field,
    label,
    help,
    registerOptions = {},
    type,
    className,
    ...opts
  } = props
  const { register } = useFormContext()
  const placeholderColor = useColorModeValue('gray.300', 'gray.100')
  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <Input
        color="text"
        _placeholder={{ color: placeholderColor }}
        type={type}
        {...opts}
        id={field}
        {...register(field as any, registerOptions)}
      />
    </FieldWrapper>
  )
}
export default chakra(InputField)

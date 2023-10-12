import { InputHTMLAttributes, ReactNode } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";

import {
  chakra,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper
} from "@chakra-ui/react";

import FieldWrapper from "./FieldWrapper";

export type Props = NumberInputProps &
  InputHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    registerOptions?: RegisterOptions
    className?: string
    leftAddon?: ReactNode | string
    rightAddon?: ReactNode | string
    showStepper?: boolean
  }

const InputField = (props: Props) => {
  const {
    field,
    label,
    help,
    registerOptions = {},
    className,
    leftAddon,
    rightAddon,
    size,
    showStepper = false,
    ...opts
  } = props
  const { register } = useFormContext()

  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <InputGroup size={size} id={field}>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
        <NumberInput size={size} w="full" {...opts}>
          <NumberInputField size={size} id={field} {...register(field as any, registerOptions)} />
          {showStepper && (
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          )}
        </NumberInput>
        {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
      </InputGroup>
    </FieldWrapper>
  )
}
export default chakra(InputField)

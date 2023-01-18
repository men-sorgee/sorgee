import { InputHTMLAttributes, ReactNode } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  chakra,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from '@chakra-ui/react'

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
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''

  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <InputGroup size={size}>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
        <NumberInput {...opts} size={size}>
          <NumberInputField
            size={size}
            className={classes}
            id={field}
            {...register(field as any, registerOptions)}
          />
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

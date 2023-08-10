import { FieldOptions } from "lib/models";
import { InputHTMLAttributes } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";

import {
  Box,
  chakra,
  Flex,
  Radio,
  RadioGroup,
  RadioProps
} from "@chakra-ui/react";

import FieldWrapper from "./FieldWrapper";

type Props = RadioProps &
  InputHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    options: FieldOptions
    registerOptions?: RegisterOptions
    className?: string
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  }

function RadioButtonsField(props: Props) {
  const {
    field,
    label,
    help,
    registerOptions = {},
    options,
    className,
    color = 'primary',
    size,
    justifyContent = 'stretch',
    ...opts
  } = props
  const { register, setValue, watch, getFieldState, formState } =
    useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''
  const fieldValue = watch(field)
  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <RadioGroup
        onChange={(v) => {
          setValue(field, v)
        }}
        value={fieldValue?.toString()}
        as={Flex}
        justifyContent={justifyContent}
        gap={[2, 4]}
      >
        {options?.map(({ text, value }, index) => (
          <Box key={index.toString()} flex={1}>
            <Radio
              {...opts}
              {...register(field, registerOptions)}
              key={index.toString()}
              defaultChecked={index === 0}
              className={classes}
              value={value}
              color="text"
            >
              {text}
            </Radio>
          </Box>
        ))}
      </RadioGroup>
    </FieldWrapper>
  )
}

export default chakra(RadioButtonsField)

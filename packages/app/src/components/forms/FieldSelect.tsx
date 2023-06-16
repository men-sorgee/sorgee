import { SelectHTMLAttributes } from 'react'

import { FieldOptions } from '@lib/models'
import { RegisterOptions, useFormContext } from 'react-hook-form'

import { chakra, Select, SelectProps } from '@chakra-ui/react'

import FieldWrapper from './FieldWrapper'

type Props = SelectProps &
  SelectHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    options: FieldOptions
    registerOptions?: RegisterOptions
    className?: string
  }

const SelectField = (props: Props) => {
  const {
    field,
    label,
    help,
    registerOptions = {},
    options,
    className,
    size,
    w,
    p,
    ...opts
  } = props
  const { register } = useFormContext()
  return (
    <FieldWrapper
      w={w}
      field={field}
      label={label}
      help={help}
      className={className}
    >
      <Select
        p={p}
        w={w}
        size={size}
        {...opts}
        {...register(field as any, registerOptions)}
      >
        {options?.map(({ text, value }, index) => (
          <option key={index.toString()} value={value}>
            {text}
          </option>
        ))}
      </Select>
    </FieldWrapper>
  )
}
export default chakra(SelectField)

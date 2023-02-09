import { SelectHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { FieldOptions } from 'lib/models'
import FieldWrapper from './FieldWrapper'
import { Select, SelectProps, chakra } from '@chakra-ui/react'

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
    <FieldWrapper w={w} field={field} label={label} help={help} className={className}>
      <Select p={p} w={w} size={size} {...opts} {...register(field as any, registerOptions)}>
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

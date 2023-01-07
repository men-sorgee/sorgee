import { SelectHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { FormOptions } from 'lib/models'
import FieldWrapper from './FieldWrapper'
import { Select, SelectProps, chakra } from '@chakra-ui/react'

type Props = SelectProps &
  SelectHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    formOptions: FormOptions
    registerOptions?: RegisterOptions
    className?: string
  }

const SelectField = (props: Props) => {
  const { field, label, help, registerOptions = {}, formOptions, className, ...opts } = props
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''
  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <Select {...opts} id={field} {...register(field as any, registerOptions)} className={classes}>
        {formOptions?.map(({ text, value }, index) => (
          <option key={index.toString()} value={value}>
            {text}
          </option>
        ))}
      </Select>
    </FieldWrapper>
  )
}
export default chakra(SelectField)

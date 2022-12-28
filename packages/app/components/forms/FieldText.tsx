import { TextareaHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'

type Props = TextareaHTMLAttributes<HTMLInputElement> & {
  field: string
  label: string
  help?: string
  registerOptions?: RegisterOptions
  className?: string
}

export default function TextField(props: Props) {
  const { field, label, help, registerOptions = {}, className } = props
  const inputProps = Object.entries(props)
    .filter(([key]) => !['field', 'label', 'help', 'registerOptions', 'className'].includes(key))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'textarea textarea-error' : 'textarea'
  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <textarea
        {...inputProps}
        id={field}
        {...register(field as any, registerOptions)}
        className={classes}
      />
    </FieldWrapper>
  )
}

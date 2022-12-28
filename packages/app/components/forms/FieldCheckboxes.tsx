import { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { FormOptions } from 'lib/models'
import FieldWrapper from './FieldWrapper'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  field: string
  label: string
  help?: string
  formOptions: FormOptions
  registerOptions?: RegisterOptions
  className?: string
}

export default function CheckboxesField(props: Props) {
  const { field, label, help, registerOptions = {}, formOptions, className } = props
  const inputProps = Object.entries(props)
    .filter(
      ([key]) =>
        !['field', 'label', 'help', 'registerOptions', 'formOptions', 'className'].includes(key)
    )
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  const { register } = useFormContext()

  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {formOptions?.map(({ text, value }, index) => (
          <div key={index.toString()} className="form-control">
            <label htmlFor={value} className="label cursor-pointer justify-start">
              <input
                id={value}
                value={value}
                type="checkbox"
                {...register(field, registerOptions)}
                className="checkbox-accent checkbox bg-accent-600"
                {...inputProps}
              />
              <span className="label-text ml-2 ">{text}</span>
            </label>
          </div>
        ))}
      </div>
    </FieldWrapper>
  )
}

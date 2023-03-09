import { InputHTMLAttributes, useState, useEffect } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { FieldOptions } from 'lib/models'
import FieldWrapper from './FieldWrapper'
import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  chakra,
  SimpleGrid,
  FormControlProps,
  Input,
} from '@chakra-ui/react'

type Props = CheckboxGroupProps &
  InputHTMLAttributes<HTMLInputElement> &
  FormControlProps & {
    field: string
    label?: string
    help?: string
    options: FieldOptions
    registerOptions?: RegisterOptions
    className?: string
    includeOther?: boolean
  }

const CheckboxesField = (props: Props) => {
  const {
    field,
    label,
    help,
    registerOptions = {},
    options,
    className,
    includeOther,
    ...opts
  } = props
  const {
    register,
    watch,
    setValue,
    formState: { defaultValues },
  } = useFormContext()
  const [other, setOther] = useState<string>(undefined)
  const [otherChecked, setOtherChecked] = useState<boolean>(false)

  let val = watch(field)
  if (!Array.isArray(val)) {
    val = [val]
  }
  useEffect(() => {
    if (includeOther) {
      const values = defaultValues[field] || []
      let o = values.find((v: string) => !options.map((o) => o.value).includes(v))
      if (o) {
        setOther(o)
        setOtherChecked(true)
      }
    }
  }, [val, options, other, includeOther, defaultValues, field])

  return (
    <FieldWrapper field={field} help={help} label={label} className={className} {...opts}>
      <SimpleGrid gap={4} columns={[2, 2, 3, 3, 4]}>
        <CheckboxGroup name={field} {...opts} defaultValue={val}>
          {options?.map(({ text, value }, index) => (
            <Checkbox key={index.toString()} value={value} {...register(field, registerOptions)}>
              {text}
            </Checkbox>
          ))}
          {includeOther && (
            <Checkbox value={other} {...register(field)}>
              Other
            </Checkbox>
          )}
        </CheckboxGroup>
        {val.includes(other) && (
          <Input
            color="text"
            size="sm"
            defaultValue={other}
            onBlur={(e) => {
              setOther(e.target.value)
              setOtherChecked(true)
              setValue(field, [...val, other])
            }}
          />
        )}
      </SimpleGrid>
    </FieldWrapper>
  )
}

export default chakra(CheckboxesField)

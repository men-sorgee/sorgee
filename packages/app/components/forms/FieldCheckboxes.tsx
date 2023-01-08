import { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { FormOptions } from 'lib/models'
import FieldWrapper from './FieldWrapper'
import { Checkbox, CheckboxGroup, Text, CheckboxProps, chakra, SimpleGrid } from '@chakra-ui/react'

type Props = CheckboxProps &
  InputHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    formOptions: FormOptions
    registerOptions?: RegisterOptions
    className?: string
  }

const CheckboxesField = (props: Props) => {
  const { field, label, help, registerOptions = {}, formOptions, className, ...opts } = props
  const { register, watch } = useFormContext()
  const fieldValue = watch(field, [])
  return (
    <FieldWrapper field={field} help={help} label={label} className={className}>
      <CheckboxGroup defaultValue={fieldValue}>
        <SimpleGrid gap={4} columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {formOptions?.map(({ text, value }, index) => (
            <Checkbox key={index.toString()} value={value} {...register(field, registerOptions)}>
              {text}
            </Checkbox>
          ))}
        </SimpleGrid>
      </CheckboxGroup>
    </FieldWrapper>
  )
}

export default chakra(CheckboxesField)

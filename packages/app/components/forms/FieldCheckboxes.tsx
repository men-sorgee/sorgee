import { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { FormOptions } from 'lib/models'
import FieldWrapper from './FieldWrapper'
import {
  Checkbox,
  CheckboxGroup,
  useCheckboxGroup,
  CheckboxProps,
  chakra,
  SimpleGrid,
} from '@chakra-ui/react'

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
  const { register, watch, setValue, getValues } = useFormContext()

  return (
    <FieldWrapper field={field} help={help} label={label} className={className}>
      <SimpleGrid gap={4} columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
        <CheckboxGroup
          onChange={(value) => {
            setValue(field, value)
          }}
          defaultValue={getValues(field)}
        >
          {formOptions?.map(({ text, value }, index) => (
            <Checkbox
              {...opts}
              key={index.toString()}
              value={value}
              {...register(field, registerOptions)}
            >
              {text}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </SimpleGrid>
    </FieldWrapper>
  )
}

export default chakra(CheckboxesField)

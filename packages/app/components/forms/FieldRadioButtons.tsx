import { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { FormOptions } from 'lib/models'
import FieldWrapper from './FieldWrapper'
import { Radio, RadioGroup, Flex, RadioProps, chakra, SimpleGrid } from '@chakra-ui/react'

type Props = RadioProps &
  InputHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    formOptions: FormOptions
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
    formOptions,
    className,
    color = 'primary',
    size,
    justifyContent = 'space-between',
    ...opts
  } = props
  const { register, setValue, watch, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''
  const fieldValue = watch(field)
  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <RadioGroup
        onChange={(v) => {
          setValue(field, v)
        }}
        value={fieldValue}
        as={Flex}
        justifyContent={justifyContent}
      >
        {formOptions?.map(({ text, value }, index) => (
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
        ))}
      </RadioGroup>
    </FieldWrapper>
  )
}

export default chakra(RadioButtonsField)

import { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { FormOptions } from 'lib/models'
import FieldWrapper from './FieldWrapper'
import { Radio, RadioGroup, Stack, RadioProps, chakra, SimpleGrid } from '@chakra-ui/react'

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
        w="full"
        as={Stack}
      >
        <Stack id={field} spacing={4} w="full" direction={{ base: 'column', md: 'row' }}>
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
        </Stack>
      </RadioGroup>
    </FieldWrapper>
  )
}

export default chakra(RadioButtonsField)

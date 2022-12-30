import { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { FormOptions } from 'lib/models'
import FieldWrapper from './FieldWrapper'
import { Radio, RadioGroup, Stack, RadioProps, chakra } from '@chakra-ui/react'

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
  const { register, getFieldState, formState } = useFormContext()
  const { error } = getFieldState(field, formState)
  const classes = error ? 'error' : ''
  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <RadioGroup
        as={Stack}
        spacing={[1, 4]}
        direction={{ base: 'column', md: 'row' }}
        justify={'evenly'}
      >
        {formOptions?.map(({ text, value }, index) => (
          <Radio
            key={index.toString()}
            className={classes}
            value={value}
            {...register(field, registerOptions)}
            {...opts}
          >
            {text}
          </Radio>
        ))}
      </RadioGroup>
    </FieldWrapper>
  )
}

export default chakra(RadioButtonsField)

import { useState } from 'react'

import { RegisterOptions, useFormContext } from 'react-hook-form'

import {
  chakra,
  Circle,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderProps,
  RangeSliderThumb,
  RangeSliderTrack
} from '@chakra-ui/react'

import FieldWrapper from './FieldWrapper'

export type Props = RangeSliderProps & {
  field: string
  label?: string
  help?: string
  registerOptions?: RegisterOptions
}

const InputField = (props: Props) => {
  const {
    field,
    label,
    help,
    registerOptions = {},
    min = 0,
    max = 10,
    step = 1,
    ...opts
  } = props

  const {
    register,
    formState: { defaultValues }
  } = useFormContext()
  const { onChange } = register(field, registerOptions)
  const initialValues = [min, max]
  const [values, setValues] = useState<number[]>(initialValues)

  if (values?.length !== 2) {
    return
  }
  return (
    <FieldWrapper field={field} label={label} help={help}>
      <RangeSlider
        // eslint-disable-next-line jsx-a11y/aria-proptypes
        aria-label={['min', 'max']}
        orientation="horizontal"
        defaultValue={values}
        {...opts}
        onChange={(val: number[]) => {
          onChange({
            target: {
              value: val
            }
          })
          setValues(val)
        }}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb bg="primary" color="white" boxSize={6} index={0}>
          <Circle p={2} rounded="full">
            {values[0]}
          </Circle>
        </RangeSliderThumb>
        <RangeSliderThumb bg="primary" color="white" boxSize={6} index={1}>
          <Circle p={2} rounded="full">
            {values[1]}
          </Circle>
        </RangeSliderThumb>
      </RangeSlider>
    </FieldWrapper>
  )
}
export default chakra(InputField)

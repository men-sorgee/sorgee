import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import {
  chakra,
  Circle,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  RangeSliderProps,
} from '@chakra-ui/react'
import { useState } from 'react'

export type Props = RangeSliderProps & {
  field: string
  label?: string
  help?: string
  registerOptions?: RegisterOptions
}

const InputField = (props: Props) => {
  const { field, label, help, registerOptions = {}, min = 0, max = 10, step = 1, ...opts } = props

  const {
    register,
    formState: { defaultValues },
    watch,
  } = useFormContext()
  const { onChange } = register(field, registerOptions)
  const [values, setValues] = useState((defaultValues && defaultValues[field]) || [min, max])

  return (
    <FieldWrapper field={field} label={label} help={help}>
      <RangeSlider
        // eslint-disable-next-line jsx-a11y/aria-proptypes
        aria-label={['min', 'max']}
        orientation="horizontal"
        defaultValue={defaultValues && defaultValues[field]}
        {...opts}
        onChange={(val: number[]) => {
          onChange({
            target: {
              value: val,
            },
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

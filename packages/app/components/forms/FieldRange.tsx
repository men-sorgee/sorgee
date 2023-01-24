import { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import {
  Input,
  InputProps,
  chakra,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  RangeSliderProps,
} from '@chakra-ui/react'

export type Props = RangeSliderProps & {
  field: string
  label?: string
  help?: string
  registerOptions?: RegisterOptions
}

const InputField = (props: Props) => {
  const { field, label, help, registerOptions = {}, ...opts } = props
  const { register } = useFormContext()
  return (
    <FieldWrapper field={field} label={label} help={help}>
      <RangeSlider {...opts}>
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>
    </FieldWrapper>
  )
}
export default chakra(InputField)

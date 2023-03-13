import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import {
  SliderProps,
  chakra,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'

export type Props = SliderProps & {
  field: string
  label?: string
  help?: string
  registerOptions?: RegisterOptions
}

const InputField = (props: Props) => {
  const { field, label, help, registerOptions = {}, ...opts } = props
  const { watch } = useFormContext()
  const value = watch(field)
  return (
    <FieldWrapper field={field} label={label} help={help}>
      <Slider value={value} {...opts}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
        <SliderMark
          value={value}
          textAlign="center"
          bg="primary.500"
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {value}
        </SliderMark>
      </Slider>
    </FieldWrapper>
  )
}
export default chakra(InputField)

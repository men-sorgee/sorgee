import React, { InputHTMLAttributes } from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import FieldWrapper from './FieldWrapper'
import { Rating, RatingControlProps } from 'components/controls/Rating'
import { chakra } from '@chakra-ui/react'

type Props = RatingControlProps &
  InputHTMLAttributes<HTMLInputElement> & {
    field: string
    label?: string
    help?: string
    registerOptions?: RegisterOptions
    className?: string
    children?: React.ReactNode | React.ReactNode[]
  }

const RatingField = (props: Props) => {
  const { field, label, help, registerOptions = {}, children, className, ...opts } = props
  const { register, watch, setValue } = useFormContext()
  const rating = Number(watch(field) || 0)

  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <Rating
        readonly={false}
        defaultValue={rating}
        {...opts}
        onRateChange={(r) => {
          setValue(field, r)
        }}
      />
    </FieldWrapper>
  )
}

export default chakra(RatingField)

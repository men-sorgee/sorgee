import React, { InputHTMLAttributes } from 'react'

import { Rating, RatingControlProps } from 'components/controls/Rating'
import { RegisterOptions, useFormContext } from 'react-hook-form'

import { chakra } from '@chakra-ui/react'

import FieldWrapper from './FieldWrapper'

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
  const {
    field,
    label,
    help,
    registerOptions = {},
    children,
    className,
    ...opts
  } = props
  const { watch, setValue } = useFormContext()
  const rating = Number(watch(field) || 0)

  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <Rating
        readonly={false}
        value={rating}
        {...opts}
        onRateChange={(r) => {
          setValue(field, r)
        }}
      />
    </FieldWrapper>
  )
}

export default chakra(RatingField)

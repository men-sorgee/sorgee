import { useState } from 'react'
import FieldWrapper from './FieldWrapper'
import { Flex, chakra } from '@chakra-ui/react'
import { PhotoUpload, PhotoUploadProps } from 'components/controls/PhotoUpload'
export type Props = PhotoUploadProps & {
  field: string
  label?: string
  help?: string
}

const FieldImages = (props: Props) => {
  const { postUrl, field, label, help, ...opts } = props

  return (
    <FieldWrapper field={field} label={label} help={help}>
      <PhotoUpload postUrl={postUrl} {...opts} />
    </FieldWrapper>
  )
}
export default chakra(FieldImages)

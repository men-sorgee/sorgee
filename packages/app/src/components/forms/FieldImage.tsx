import { PhotoUpload, PhotoUploadProps } from 'components/controls/PhotoUpload'

import { chakra } from '@chakra-ui/react'

import FieldWrapper from './FieldWrapper'

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

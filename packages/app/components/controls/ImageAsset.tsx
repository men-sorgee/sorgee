import { DirectusFile } from 'lib/models'

import { chakra, Image, ImageProps } from '@chakra-ui/react'

type Props = ImageProps & {
  fileId: string | DirectusFile
}

export const ImageAsset = chakra(({ fileId, height, width = '150px', alt, ...props }: Props) => {
  if (!fileId) return null
  return (
    <Image
      boxSize={width}
      objectFit="cover"
      src={`/api/asset/${fileId}`}
      height={height}
      width={width}
      alt={alt}
      {...props}
    />
  )
})

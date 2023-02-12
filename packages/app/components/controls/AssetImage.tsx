import { chakra, Image, ImageProps } from '@chakra-ui/react'
import { DirectusFile } from 'lib/models'

type Props = ImageProps & {
  fileId: string
}

export const AssetImage = chakra(({ fileId, height, width = '150px', alt, ...props }: Props) => {
  return (
    <Image
      bg="gray.100"
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

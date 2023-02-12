import { chakra, Image, ImageProps } from '@chakra-ui/react'
import { DirectusFile } from 'lib/models'

type Props = ImageProps & {
  file: DirectusFile
}

export const AssetImage = chakra(({ file, height, width, alt, ...props }: Props) => {
  return (
    <Image
      src={`/pages/api/assets/${file.id}`}
      height={height || file.height}
      width={width || file.width}
      alt={alt || file.description}
      {...props}
    />
  )
})

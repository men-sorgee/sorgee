import { chakra, Image, ImageProps } from '@chakra-ui/react'

interface Props extends ImageProps {
  id: string
}

export const AssetImage = chakra(({ src, height, width, alt, ...props }: Props) => {
  src = `/pages/api/assets/${src}`
  return <Image src={src} height={height} width={width} alt={alt} {...props} />
})

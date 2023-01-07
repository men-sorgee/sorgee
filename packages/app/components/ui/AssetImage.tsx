import { chakra, Image, ImageProps } from '@chakra-ui/react'

interface Props extends ImageProps {
  id: string
}

const AssetImage = ({ src, ...props }: Props) => {
  src = `/pages/api/assets/${src}`
  return <Image src={src} {...props} />
}

export default chakra(AssetImage)

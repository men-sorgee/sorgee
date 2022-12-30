import { chakra, Image, ImageProps } from '@chakra-ui/react'

interface Props extends ImageProps {
  id: string
}

const AssetImage = ({ id, ...props }: Props) => {
  const src = `/pages/api/assets/${id}`
  return <Image src={src} {...props} />
}

export default chakra(AssetImage)

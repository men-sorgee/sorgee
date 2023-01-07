import { chakra, StyleProps, Image, ImageProps as Props } from '@chakra-ui/react'
import { ImageProps as NextProps } from 'next/image'
import NextImage from 'next/image'
import { useState, useEffect } from 'react'

export type ImageProps = Props &
  NextProps & {
    src: string
  }

const BlurImage = ({ src, ...props }: ImageProps) => {
  const [isLoading, setLoading] = useState(true)

  return (
    <Image
      as={NextImage}
      {...props}
      src={src}
      alt={props.alt}
      filter={isLoading ? 'blur(20px)' : 'none'}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
      onLoadingComplete={async () => {
        setLoading(false)
      }}
    />
  )
}

export default chakra(BlurImage)

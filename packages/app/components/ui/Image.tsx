import Image, { ImageProps } from 'next/image'
import { useState, useEffect } from 'react'

export default function BlurImage(props: ImageProps) {
  const [isLoading, setLoading] = useState(true)
  const [src, setSrc] = useState(props.src)
  useEffect(() => setSrc(props.src), [props.src]) // update the `src` value when the `prop.src` value changes

  return (
    <Image
      {...props}
      src={src}
      alt={props.alt}
      className={`${props.className} transition-all ${
        isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
      }`}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
      onLoadingComplete={async () => {
        setLoading(false)
      }}
    />
  )
}

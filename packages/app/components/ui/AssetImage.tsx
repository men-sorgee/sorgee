interface Props {
  id: string
  height: number
  width: number
  alt: string
}

const AssetImage = ({ id, height, width, alt }: Props) => {
  const src = `/pages/api/assets/${id}`
  return <img src={src} height={height} width={width} alt={alt} />
}

export default AssetImage

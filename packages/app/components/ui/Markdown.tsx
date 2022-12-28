import { ClassAttributes, ImgHTMLAttributes, useEffect } from 'react'
import { useRemark } from 'react-remark'
export default function Markdown({ content }: { content: string }) {
  const [reactContent, setMarkdownSource] = useRemark({
    rehypeReactOptions: {
      components: {
        img: ({
          height,
          width,
          alt,
          ...props
        }: JSX.IntrinsicAttributes &
          ClassAttributes<HTMLImageElement> &
          ImgHTMLAttributes<HTMLImageElement>) => {
          return (
            <img
              {...props}
              height={height || 250}
              width={width || 500}
              alt={alt || 'guysnheat image'}
            />
          )
        },
      },
    },
  })
  useEffect(() => {
    setMarkdownSource(content)
  }, [])
  return reactContent
}

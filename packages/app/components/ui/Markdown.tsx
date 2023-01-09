import { useEffect } from 'react'
import { useRemark } from 'react-remark'
import { Heading, Image, ListItem, OrderedList, Text, UnorderedList } from '@chakra-ui/react'
export default function Markdown({ content }: { content: string }) {
  const [reactContent, setMarkdownSource] = useRemark({
    rehypeReactOptions: {
      components: {
        img: ({ height, width, alt, ...props }) => {
          return (
            <Image
              {...props}
              height={height || 250}
              width={width || 500}
              alt={alt || 'guysnheat image'}
            />
          )
        },
        p: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text>,
        h1: ({ children }: { children: React.ReactNode }) => <Heading as="h1">{children}</Heading>,
        h2: ({ children }: { children: React.ReactNode }) => <Heading as="h2">{children}</Heading>,
        h3: ({ children }: { children: React.ReactNode }) => <Heading as="h3">{children}</Heading>,
        h4: ({ children }: { children: React.ReactNode }) => <Heading as="h4">{children}</Heading>,
        h5: ({ children }: { children: React.ReactNode }) => <Heading as="h5">{children}</Heading>,
        ul: ({ children }: { children: React.ReactNode }) => (
          <UnorderedList>{children}</UnorderedList>
        ),
        ol: ({ children }: { children: React.ReactNode }) => <OrderedList>{children}</OrderedList>,
        li: ({ children }: { children: React.ReactNode }) => <ListItem>{children}</ListItem>,
      },
    },
  })
  useEffect(() => {
    setMarkdownSource(content)
  }, [content, setMarkdownSource])
  return reactContent
}

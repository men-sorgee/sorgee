import { useEffect } from 'react'
import { useRemark } from 'react-remark'
import { Alert, Heading, Image, ListItem, OrderedList, Text, UnorderedList } from '@chakra-ui/react'

export const Markdown = ({ content, size }: { content: string; size?: string }) => {
  const [reactContent, setMarkdownSource] = useRemark({
    rehypeReactOptions: {
      components: {
        img: ({ height, src, width, alt, ...props }) => {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              src={src}
              width="100%"
              rounded="lg"
              boxShadow="lg"
              alt={alt || 'guysnheat image'}
              {...props}
            />
          )
        },
        p: ({ children }: { children: React.ReactNode }) => <Text size={size}>{children}</Text>,
        h1: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h1" size={size || 'h1'}>
            {children}
          </Heading>
        ),
        h2: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h2" size={size || 'h2'}>
            {children}
          </Heading>
        ),
        h3: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h3" size={size || 'h3'}>
            {children}
          </Heading>
        ),
        h4: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h4" size={size || 'h4'}>
            {children}
          </Heading>
        ),
        h5: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h5" size={size || 'h5'}>
            {children}
          </Heading>
        ),
        ul: ({ children }: { children: React.ReactNode }) => (
          <UnorderedList display="block" ml="1rem" mt={1} listStylePosition="outside">
            {children}
          </UnorderedList>
        ),
        ol: ({ children }: { children: React.ReactNode }) => (
          <OrderedList display="block" ml="1rem" listStylePosition="outside">
            {children}
          </OrderedList>
        ),
        li: ({ children }: { children: React.ReactNode }) => (
          <ListItem fontSize={size} mb={1}>
            {children}
          </ListItem>
        ),
        blockquote: ({ children }: { children: React.ReactNode }) => (
          <Alert rounded="lg" shadow="lg" mt={4}>
            <Heading w="full" as="h5" size={size} m={0} textAlign="center">
              {children}
            </Heading>
          </Alert>
        ),
      },
    },
  })
  useEffect(() => {
    setMarkdownSource(content)
  }, [content, setMarkdownSource])
  return reactContent
}

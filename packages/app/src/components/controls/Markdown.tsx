'use client'

import NextLink from "next/link";
import { memo, useEffect } from "react";
import { useRemark } from "react-remark";

import {
  Alert,
  Heading,
  Icon,
  Image,
  Link,
  ListItem,
  OrderedList,
  Text,
  TextProps,
  UnorderedList
} from "@chakra-ui/react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export type MarkdownProps = TextProps & {
  content: string
  size?: string
}
export const Markdown = memo(function Markdown({ content, size, noOfLines, ...props }: MarkdownProps) {
  const [reactContent, setMarkdownSource] = useRemark({
    rehypeReactOptions: {
      components: {
        a: ({ href, children }: { href: string; children: React.ReactNode }) => {
          return (
            <Link
              as={NextLink}
              href={href}
              target={href.startsWith('http') ? '_blank' : '_self'}
              color="text"
              textDecoration={'underline'}
            >
              {children}&nbsp;
              {href.startsWith('http') && <Icon as={ArrowTopRightOnSquareIcon} width="1rem" />}
            </Link>
          )
        },
        img: ({ src, alt, ...props }) => {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              loading="lazy"
              src={src}
              w={'full'}
              rounded="lg"
              boxShadow="lg"
              alt={alt || 'guysnheat image'}
              {...props}
            />
          )
        },
        p: ({ children }: { children: React.ReactNode }) => (
          <Text noOfLines={noOfLines} fontSize={size} {...props}>
            {children}
          </Text>
        ),
        h1: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h1" size={size || 'h1'} {...props}>
            {children}
          </Heading>
        ),
        h2: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h2" size={size || 'h2'} {...props}>
            {children}
          </Heading>
        ),
        h3: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h3" size={size || 'h3'} {...props}>
            {children}
          </Heading>
        ),
        h4: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h4" size={size || 'h4'} {...props}>
            {children}
          </Heading>
        ),
        h5: ({ children }: { children: React.ReactNode }) => (
          <Heading as="h5" size={size || 'h5'} {...props}>
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
          <Alert rounded="lg" shadow="md" my={4} p={4} textAlign="center" as="blockquote">
            <Text
              as="blockquote"
              size={size || 'h5'}
              m={0}
              p={0}
              textAlign="center"
              color="text"
              w="full"
            >
              {children}
            </Text>
          </Alert>
        ),
        hr: () => <hr style={{ margin: '2rem 0' }} />,
        code: ({ children }: { children: React.ReactNode }) => (
          <Text
            as="code"
            fontSize={size}
            color="white"
            bg="gray.700"
            rounded="md"
            px={2}
            py={1}
            w="full"
            fontWeight="bold"
          >
            {children}
          </Text>
        ),
      },
    },
  })
  useEffect(() => {
    setMarkdownSource(content || '')
  }, [content, setMarkdownSource])
  return reactContent
})

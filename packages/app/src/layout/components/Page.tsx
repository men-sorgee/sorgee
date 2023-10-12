import { Loading } from "components";
import { useMeta } from "hooks/use-meta";
import { useRouter } from "next/router";
import { useEffect } from "react";

import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  chakra,
  Heading,
  Text
} from "@chakra-ui/react";

export type PageProps = BoxProps & {
  id?: string
  title: string
  loading?: boolean
  image?: string
  header?: React.ReactNode
  children: React.ReactNode | React.ReactNode[]
  description?: string
  hideHeader?: boolean
  full?: boolean
}

export const Page = chakra(
  ({
    id,
    title,
    loading,
    description,
    header,
    image,
    children,
    hideHeader = false,
    full = false,
    ...props
  }: PageProps) => {
    const router = useRouter()

    const { setMeta } = useMeta()
    useEffect(() => {
      setMeta(title, description, image)
    }, [description, image, setMeta, title])

    const { error: e } = router.query
    const error = e as string

    const ErrorAlert = () =>
      error != undefined && (
        <Alert status="error" mb={8} rounded="lg" shadow="lg">
          <AlertIcon />
          <Text my={0}>{error}</Text>
        </Alert>
      )

    if (loading) {
      return (
        <>
          <div className="no-print">
            <Heading as="h1" size="h1" textAlign="center" mb={8}>
              {title}
            </Heading>
            <ErrorAlert />
            <Loading size="xl" mt={10} />
          </div>
        </>
      )
    }

    return (
      <Box
        id={id}
        direction="column"
        as="article"
        alignItems={'center'}
        justifyItems="stretch"
        px={full ? 0 : [1, 2]}
        w="full"
        {...props}
      >
        {!hideHeader && (
          <div className="no-print">
            <Heading as="h1" size="h1" textAlign="center" mb={8}>
              {title}
            </Heading>
            <ErrorAlert />
          </div>
        )}
        {header}
        {children}
      </Box>
    )
  }
)

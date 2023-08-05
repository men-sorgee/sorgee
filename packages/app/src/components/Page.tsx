import { Loading } from "components/controls";
import { useMeta } from "hooks/use-meta";
import { useEffect } from "react";

import { Box, BoxProps, chakra, Heading } from "@chakra-ui/react";

type Props = BoxProps & {
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

const Page = ({
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
}: Props) => {
  const { setMeta } = useMeta()
  useEffect(() => {
    setMeta(title, description, image)
  }, [description, image, setMeta, title])

  if (loading) {
    return (
      <>
        <div className="no-print">
          <Heading as="h1" size="h1" textAlign="center" mb={8}>
            {title}
          </Heading>
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
        </div>
      )}
      {header}
      {children}
    </Box>
  )
}

export default chakra(Page)

import { useMeta } from 'hooks/use-meta'
import { Loading, PullToRefresh } from 'components/controls'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from './AccessDenied'
import { Flex, BoxProps, chakra, Box, Heading } from '@chakra-ui/react'

type Props = BoxProps & {
  id?: string
  title: string
  loading?: boolean
  image?: string
  header?: React.ReactNode
  children: React.ReactNode | React.ReactNode[]
  description?: string
  sectionClass?: string
  requireAuth?: boolean
}

const Page = ({
  id,
  title,
  loading,
  description,
  header,
  image,
  children,
  requireAuth = false,
  ...props
}: Props) => {
  const { setMeta } = useMeta()
  const { status } = useSession()
  const [denied, setDenied] = useState(false)
  useEffect(() => {
    setMeta(title, description, image)
    if (status != 'loading' && requireAuth && status !== 'authenticated') {
      setDenied(true)
    }
  }, [description, image, requireAuth, setMeta, status, title])

  if (denied) {
    return <AccessDenied />
  }

  return (
    <Box
      id={id}
      direction="column"
      as="article"
      alignItems={'center'}
      justifyItems="stretch"
      {...props}
    >
      <div className="no-print">
        <Heading textAlign="center" as="h1" size="4xl" mb={4}>
          {title}
        </Heading>
      </div>
      {header}
      {(loading && (
        <Loading size="xl">
          <h2>hold please</h2>
        </Loading>
      )) ||
        children}
    </Box>
  )
}

export default chakra(Page)

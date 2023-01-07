import { setMeta } from 'hooks/use-meta'
import Loading from 'components/ui/Loading'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from './AccessDenied'
import { Box, Heading } from '@chakra-ui/react'

interface Props {
  title: string
  loading?: boolean
  header?: React.ReactNode
  children: React.ReactNode | React.ReactNode[]
  description?: string
  sectionClass?: string
  titleClass?: string
  requireAuth?: boolean
}

const Page = ({
  title,
  loading,
  description,
  header,
  sectionClass = '',
  children,
  titleClass,
  requireAuth = false,
}: Props) => {
  setMeta(title, description)
  const { status } = useSession()
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (status != 'loading' && requireAuth && status !== 'authenticated') {
      setDenied(true)
    }
  }, [status])

  if (denied) {
    return <AccessDenied />
  }

  return (
    <Box className={sectionClass} as="article">
      <Heading as="h1" size={'2xl'} className={titleClass}>
        {title}
      </Heading>
      <Box>
        {header}
        {(loading && (
          <Loading size="xl">
            <Heading as="h2">hold up</Heading>
          </Loading>
        )) ||
          children}
      </Box>
    </Box>
  )
}

export default Page

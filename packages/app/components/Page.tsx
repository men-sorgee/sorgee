import { setMeta } from 'hooks/use-meta'
import Loading from 'components/ui/Loading'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from './AccessDenied'
import { VStack, Heading } from '@chakra-ui/react'
import { DirectusFile } from 'lib/models'

interface Props {
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
  title,
  loading,
  description,
  header,
  image,
  sectionClass = '',
  children,
  requireAuth = false,
}: Props) => {
  setMeta(title, description, image)
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
    <VStack spacing={2} className={sectionClass} as="article" align={['start', 'center']}>
      <Heading as="h1" fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}>
        {title}
      </Heading>

      {header}
      {(loading && (
        <Loading size="xl">
          <Heading as="h2">hold up</Heading>
        </Loading>
      )) ||
        children}
    </VStack>
  )
}

export default Page

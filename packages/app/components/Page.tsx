import { useMeta } from 'hooks/use-meta'
import Loading from 'components/ui/Loading'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import AccessDenied from './AccessDenied'
import { Flex, Heading, FlexProps, chakra } from '@chakra-ui/react'
import { useRouter } from 'next/router'

type Props = FlexProps & {
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
    <Flex
      id={id}
      direction="column"
      as="article"
      alignItems={'center'}
      justifyItems="stretch"
      {...props}
    >
      <h1>{title}</h1>

      {header}
      {(loading && (
        <Loading size="xl">
          <h2>hold up</h2>
        </Loading>
      )) ||
        children}
    </Flex>
  )
}

export default chakra(Page)

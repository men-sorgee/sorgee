import { useMeta } from 'hooks/use-meta'
import { Loading } from 'components/controls'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from './AccessDenied'
import { Flex, BoxProps, chakra, Box, Heading } from '@chakra-ui/react'
import { MemberLevel } from '../lib/models'

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
  requiredLevel?: MemberLevel
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
  requiredLevel,
  ...props
}: Props) => {
  const { setMeta } = useMeta()
  const { data: session, status } = useSession()
  const [denied, setDenied] = useState(false)
  useEffect(() => {
    setMeta(title, description, image)
    if (status != 'loading' && requireAuth) {
      if (status !== 'authenticated') setDenied(true)
      else if (session.user) {
        const level = MemberLevel[session.user.user_type as string]
        setDenied(level < requiredLevel)
      }
    }
  }, [
    description,
    image,
    requireAuth,
    requiredLevel,
    session?.user,
    session?.user.user_type,
    setMeta,
    status,
    title,
  ])

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
      px={0}
      w="full"
      {...props}
    >
      <div className="no-print">
        <Heading as="h1" size="h1" textAlign="center" mb={8}>
          {title}
        </Heading>
      </div>
      {header}
      {(loading && (
        <Loading size="xl" mt={10}>
          <h2>hold please</h2>
        </Loading>
      )) ||
        children}
    </Box>
  )
}

export default chakra(Page)

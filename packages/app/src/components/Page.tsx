import { useEffect, useState } from 'react'

import { Loading } from 'components/controls'
import { useMeta } from 'hooks/use-meta'
import { MemberLevel } from 'lib/models'
import { useSession } from 'next-auth/react'

import { Box, BoxProps, chakra, Heading } from '@chakra-ui/react'

import AccessDenied from './AccessDenied'

type Props = BoxProps & {
  id?: string
  title: string
  loading?: boolean
  image?: string
  header?: React.ReactNode
  children: React.ReactNode | React.ReactNode[]
  description?: string
  requireAuth?: boolean
  requiredLevel?: MemberLevel
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
  requireAuth = false,
  hideHeader = false,
  requiredLevel,
  full = false,
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
    title
  ])

  if (denied) {
    return <AccessDenied />
  }

  if (loading) {
    return <Loading size="xl" mt={10} />
  }

  return (
    <Box
      id={id}
      direction="column"
      as="article"
      alignItems={'center'}
      justifyItems="stretch"
      px={full ? 0 : [2, 0]}
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

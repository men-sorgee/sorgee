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
  const { data: session, status } = useSession()
  useEffect(() => {
    setMeta(title, description, image)
  }, [description, image, setMeta, status, title])

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

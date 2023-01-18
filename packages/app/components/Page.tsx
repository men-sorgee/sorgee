import { useMeta } from 'hooks/use-meta'
import Loading from 'components/ui/Loading'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import AccessDenied from './AccessDenied'
import { Flex, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface Props {
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
  sectionClass = '',
  children,
  requireAuth = false,
}: Props) => {
  const { setMeta } = useMeta()

  const [routeChanging, setRouteChanging] = useState(false)
  const router = useRouter()
  const { status } = useSession()
  const [denied, setDenied] = useState(false)

  const routeStart = useCallback(
    (url: string) => {
      console.log('route start', url, router.asPath)
      const incoming = url.split('?')[0]
      const path = router.asPath.split('?')[0]
      if (incoming !== path) setRouteChanging(true)
    },
    [router.asPath]
  )

  const routeComplete = useCallback(() => {
    if (routeChanging) setRouteChanging(false)
  }, [routeChanging])

  useEffect(() => {
    setMeta(title, description, image)
    if (status != 'loading' && requireAuth && status !== 'authenticated') {
      setDenied(true)
    }
    router.events.on('routeChangeStart', routeStart)
    router.events.on('routeChangeComplete', routeComplete)
    return () => {
      router.events.off('routeChangeStart', routeStart)
      router.events.off('routeChangeComplete', routeComplete)
    }
  }, [
    description,
    image,
    requireAuth,
    routeComplete,
    routeStart,
    router.events,
    setMeta,
    status,
    title,
  ])

  if (routeChanging) {
    return <Loading size="xl" />
  }

  if (denied) {
    return <AccessDenied />
  }

  return (
    <Flex
      id={id}
      direction="column"
      as="article"
      alignItems={['left', 'center']}
      justifyItems="center"
    >
      <Heading
        as="h1"
        textAlign={['left', 'center']}
        size={['2xl', '4xl']}
        lineHeight={['3rem', '6rem']}
        w="full"
      >
        {title}
      </Heading>

      {header}
      {(loading && (
        <Loading size="xl">
          <Heading as="h2">hold up</Heading>
        </Loading>
      )) ||
        children}
    </Flex>
  )
}

export default Page

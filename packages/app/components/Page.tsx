import { useMeta } from 'hooks/use-meta'
import Loading from 'components/ui/Loading'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import AccessDenied from './AccessDenied'
import { VStack, Heading } from '@chakra-ui/react'
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
  setMeta(title, description, image)
  const [routeChanging, setRouteChanging] = useState(false)
  const router = useRouter()
  const { status } = useSession()
  const [denied, setDenied] = useState(false)

  const routeStart = useCallback(
    (url: string) => {
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
    if (status != 'loading' && requireAuth && status !== 'authenticated') {
      setDenied(true)
    }
    router.events.on('routeChangeStart', routeStart)
    router.events.on('routeChangeComplete', routeComplete)
    return () => {
      router.events.off('routeChangeStart', routeStart)
      router.events.off('routeChangeComplete', routeComplete)
    }
  }, [requireAuth, routeComplete, routeStart, router.events, status])

  if (routeChanging) {
    return <Loading size="xl" />
  }

  if (denied) {
    return <AccessDenied />
  }

  return (
    <VStack id={id} spacing={2} className={sectionClass} as="article" align={['start', 'center']}>
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

import { setMeta } from 'hooks'
import Loading from 'components/ui/Loading'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from './AccessDenied'

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
    <article>
      <h1 className={titleClass}>{title}</h1>
      <div className={`w-full ${sectionClass}`}>
        {header}
        {(loading && (
          <Loading>
            <h3>Loading</h3>
          </Loading>
        )) ||
          children}
      </div>
    </article>
  )
}

export default Page

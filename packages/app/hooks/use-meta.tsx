'use client'
import { useRouter } from 'next/router'
import { MetaProps } from 'lib/models'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSite } from './use-site'

type Context = MetaProps & {
  setMeta: (title: string, description?: string, image?: string) => void
  metaBlob?: any
  setMetaBlob: (metaBlob: any) => void
  basePath: string
  path: string
}

export const MetaContext = createContext<Context>(undefined)

export function MetaProvider(props: any) {
  const { site } = useSite()
  const router = useRouter()
  const [t, setTitle] = useState<string>(site?.site_title)
  const [d, setDescription] = useState<string>(site?.description + ' (Photo by Matheus Ferrero)')
  const [i, setImage] = useState<string>('/images/home-bg.jpg')
  const [m, setMetaBlob] = useState<any>()

  const setMeta = useCallback((t: string, d?: string, i?: string) => {
    if (t) setTitle(t)
    if (d) setDescription(d)
    if (i) setImage(i)
  }, [])

  const meta: Context = {
    title: t,
    description: d,
    basePath: router.basePath,
    url: `${router.basePath}${router.asPath}`,
    path: router.asPath,
    metaBlob: m,
    image: i,
    setMeta,
    setMetaBlob,
  }

  return <MetaContext.Provider value={meta}>{props.children}</MetaContext.Provider>
}

export const useMeta = () => useContext(MetaContext)

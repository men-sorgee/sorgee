'use client'
import { useRouter } from 'next/router'
import { MetaProps } from 'lib/models'
import { createContext, useContext, useEffect, useState } from 'react'

type Context = MetaProps & {
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  metaBlob?: any
  setMetaBlob: (metaBlob: any) => void
  setImage: (image: string) => void
  basePath: string
  path: string
}

export const MetaContext = createContext<Context | undefined>(undefined)
export function MetaContextProvider(props: any) {
  const router = useRouter()
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [image, setImage] = useState<string>()
  const [metaBlob, setMetaBlob] = useState<any>()

  const meta: Context = {
    title,
    setTitle,
    description,
    setDescription,
    basePath: router.basePath,
    url: `${router.basePath}${router.asPath}`,
    path: router.asPath,
    metaBlob,
    setMetaBlob,
    image,
    setImage,
  }

  return <MetaContext.Provider value={meta}>{props.children}</MetaContext.Provider>
}

export const useMetaContext = () => {
  const context = useContext(MetaContext)
  if (context === undefined) {
    throw new Error(`useMetaContext must be used within a MetaContextProvider.`)
  }
  return context
}

export const setMeta = (title: string, description?: string, image?: string) => {
  const {
    title: t,
    setTitle,
    description: d,
    setDescription,
    image: i,
    setImage,
  } = useMetaContext()

  useEffect(() => {
    if (title && title != t) setTitle(title)
    if (description && description != d) setDescription(description)
    if (image && image != i) setImage(image)
  }, [title, description, t, d, setTitle, setDescription])

  return { title: t, description: d, image: i }
}

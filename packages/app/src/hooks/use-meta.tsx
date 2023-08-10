import { MetaProps } from "lib/models";
import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

import { useSite } from "./use-site";

export type MetaContextData = MetaProps & {
  siteTitle: string
  setMeta: (title: string, description?: string, image?: string) => void
  metaBlob?: any
  setMetaBlob: (metaBlob: any) => void
  basePath: string
  path: string
}

export const MetaContext = createContext<MetaContextData>(undefined)

export function MetaContextProvider(props: any) {
  const { site, loading } = useSite()
  const router = useRouter()
  const [siteTitle, setSiteTitle] = useState<string>(site?.site_title)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>(site?.description)
  const [image, setImage] = useState<string>('/images/guys-mountain.jpg')
  const [metaBlob, setMetaBlob] = useState<any>()

  const setMeta = useCallback((t: string, d?: string, i?: string) => {
    if (t) setTitle(t)
    if (d) setDescription(d)
    if (i) setImage(i)
  }, [])

  useEffect(() => {
    if (!loading && site?.site_title) {
      setSiteTitle(site.site_title)
    }
  }, [site?.site_title, title, loading, router])

  const meta: MetaContextData = {
    siteTitle,
    title: `${title} :: ${siteTitle}`,
    description,
    basePath: router.basePath,
    url: `${router.basePath}${router.asPath}`,
    path: router.asPath,
    metaBlob,
    image,
    setMeta,
    setMetaBlob
  }

  return (
    <MetaContext.Provider value={meta}>{props.children}</MetaContext.Provider>
  )
}

export const useMeta = () => useContext(MetaContext)

import { useRouter } from 'next/router';
import { useEffect, useState, createContext, useContext } from 'react';
import getConfig from 'next/config';
import { MetaProps, Props } from 'models';
import { MenuPage } from '../services/directus/static';

type Context = MetaProps & {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  metaBlob?: any;
  setMetaBlob: (metaBlob: any) => void;
  setImage: (image: string) => void;
  basePath: string;
  path: string;
  pages?: Array<MenuPage>;
  setPages: (pages: Array<MenuPage>) => void;
};

const { publicRuntimeConfig } = getConfig();
export const MetaContext = createContext<Context | undefined>(undefined);
export function MetaContextProvider(props: Props) {
  const router = useRouter();
  const [title, setTitle] = useState<string>(publicRuntimeConfig.title);
  const [description, setDescription] = useState<string>(
    publicRuntimeConfig.description
  );
  const [image, setImage] = useState<string>(publicRuntimeConfig.image);
  const [metaBlob, setMetaBlob] = useState<any>();
  const [pages, setPages] =
    useState<Array<{ title: string; path: string }>>(undefined);

  const meta: Context = {
    title,
    description,
    basePath: router.basePath,
    url: `${router.basePath}${router.asPath}`,
    path: router.asPath,
    setTitle,
    setDescription,
    metaBlob,
    setMetaBlob,
    image,
    setImage,
    pages,
    setPages
  };

  return (
    <MetaContext.Provider value={meta}>{props.children}</MetaContext.Provider>
  );
}

export const useMetaContext = () => {
  const context = useContext(MetaContext);
  if (context === undefined) {
    throw new Error(
      `useMetaContext must be used within a MetaContextProvider.`
    );
  }
  return context;
};

export const useMeta = (
  title: string,
  description?: string,
  image?: string,
  pages?: MenuPage[]
) => {
  const {
    title: t,
    setTitle,
    description: d,
    setDescription,
    image: i,
    setImage,
    pages: p,
    setPages
  } = useMetaContext();
  useEffect(() => {
    if (title && title != t) setTitle(title);
    if (description && description != d) setDescription(description);
    if (image && image != i) setImage(image);
    if (pages && pages != p) setPages(pages);
  }, [title, description, t, d, setTitle, setDescription]);

  return { title: t, description: d, image: i, pages: p };
};

import { useRouter } from 'next/router';
import { useEffect, useState, createContext, useContext } from 'react';
import getConfig from 'next/config';
import { MetaProps, Props, PageItem } from 'lib/models';

type Context = MetaProps & {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  metaBlob?: any;
  setMetaBlob: (metaBlob: any) => void;
  setImage: (image: string) => void;
  basePath: string;
  path: string;
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
    setTitle,
    description,
    setDescription,
    basePath: router.basePath,
    url: `${router.basePath}${router.asPath}`,
    path: router.asPath,
    metaBlob,
    setMetaBlob,
    image,
    setImage
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

export const setMeta = (
  title: string,
  description?: string,
  image?: string,
  pages?: PageItem[]
) => {
  const {
    title: t,
    setTitle,
    description: d,
    setDescription,
    image: i,
    setImage
  } = useMetaContext();
  useEffect(() => {
    if (title && title != t) setTitle(title);
    if (description && description != d) setDescription(description);
    if (image && image != i) setImage(image);
  }, [title, description, t, d, setTitle, setDescription]);

  return { title: t, description: d, image: i };
};

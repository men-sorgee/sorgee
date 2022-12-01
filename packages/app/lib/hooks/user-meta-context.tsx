import { useRouter } from 'next/router';
import { useEffect, useState, createContext, useContext } from 'react';
import getConfig from 'next/config';
import { MetaProps } from 'lib/types';

type Context = MetaProps & {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  metaBlob?: any;
  setMetaBlob: (metaBlob: any) => void;
  setImage: (image: string) => void;
  basePath: string;
  path: string;
};

export interface Props {
  [propName: string]: any;
}

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

export const useMeta = (title: string, description?: string) => {
  const {
    title: t,
    setTitle,
    setDescription,
    description: d
  } = useMetaContext();
  useEffect(() => {
    if (title != t) setTitle(title);
    if (description != d) setDescription(description);
  }, [title, description, t, d, setTitle, setDescription]);

  return { title: t, description: d };
};

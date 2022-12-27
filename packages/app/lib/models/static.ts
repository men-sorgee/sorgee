import { Path, UnPackAsyncDefaultValues } from 'react-hook-form';
import { PageContent } from './directus';

export type File = {
  filepath: string;
  newFilename: string;
  originalFilename: string;
  mimetype: string;
};

export type FormOptions = Array<{
  text: string;
  value: string;
}>;

export interface Props {
  [propName: string]: any;
  children?: React.ReactNode | React.ReactNode[];
}

export interface ApiResponse<T = (object & never) | any> {
  error?: {
    field: Path<UnPackAsyncDefaultValues<T>>;
    message: string;
  };
  data?: T;
}

export function ApiResponse<T = (object & never) | any>(
  data: T,
  error?: string,
  field?: Path<UnPackAsyncDefaultValues<T>>
): ApiResponse<T> {
  return {
    data,
    error: error ? { message: error, field } : undefined
  };
}

export interface MetaProps {
  title: string;
  description?: string;
  basePath?: string;
  url?: string;
  image?: string;
}

export enum ContentStatusType {
  Published = 'published',
  Draft = 'draft'
}

export type SectionContainerType =
  | 'grid-cols-1'
  | 'grid-cols-2'
  | 'grid-cols-3'
  | 'grid-cols-4';

export type ContentType = 'html' | 'md' | 'image' | 'control';

export type CMSPageProps = {
  title: string;
  description: string;
  content: PageContent[];
};

export type PageItem = {
  title: string;
  path: string;
};

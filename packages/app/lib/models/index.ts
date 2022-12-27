import { FieldPath, Path, UnPackAsyncDefaultValues } from 'react-hook-form';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    name?: string;
  }
}

export * from './events';
export * from './users';
export * from './static';
export * from './directus';

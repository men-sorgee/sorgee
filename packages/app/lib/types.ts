declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    name?: string;
  }
}
export type FormOptions = Array<{
  text: string;
  value: string;
}>;

export interface Props {
  [propName: string]: any;
  children?: React.ReactNode | React.ReactNode[];
}

export interface ApiResponse<T = never | any> {
  error?: {
    field: string;
    message: string;
  };
  data?: T;
}

export function ApiResponse<T = never | any>(
  data: T,
  error?: string,
  field?: string
): ApiResponse<T> {
  return {
    data,
    error: error ? { message: error, field } : undefined
  };
}

export type SubscriptionData = {
  name?: string;
  email?: string;
};

export type AgreementData = {
  agree: boolean;
};

export type InviteLink = {
  email: string;
  link: string;
};

export interface MetaProps {
  title: string;
  description?: string;
  basePath?: string;
  url?: string;
  image?: string;
}

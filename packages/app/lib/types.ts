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

export interface IApiResponse<T = never | any> {
  ok: boolean;
  error?: { message: string };
  errors?: Array<{
    extensions: {
      field: keyof T & string;
    };
    message: string;
  }>;
  data?: T;
}

export class ApiResponse<T = never | any>
  implements IApiResponse, IApiResponse<T>
{
  public ok: boolean = true;
  public error?: { message: string };
  constructor(error?: string, public data?: T) {
    if (error) {
      this.ok = false;
      this.error = { message: error };
    }
  }
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

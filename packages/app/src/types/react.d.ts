import "react";

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    name?: string
  }
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> { }
}

declare namespace JSX { }

declare global {

  type DefaultTo<T, Fallback> = T extends null | undefined ? Fallback : T
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

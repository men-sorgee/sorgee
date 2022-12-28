import * as React from 'react'
declare module 'react' {
  
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    name?: string;
  }
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {}
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
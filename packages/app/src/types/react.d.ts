import * as React from 'react'
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
      'whereby-embed': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          minimal?: boolean
          room: string
          displayName?: string
          roomMode?: 'normal' | 'group'
          topToolbar?: 'on' | 'off'
          breakout?: 'on' | 'off'
          avatarUrl?: string
        },
        HTMLElement
      >
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'pricing-table-id': string
        'publishable-key': string

      },
        HTMLElement
      >
    }

    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

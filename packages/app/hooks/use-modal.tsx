'use client'
import { ReactNode, useState } from 'react'

type Context = {
  header?: string
  setHeader: (title: string) => void
  body?: string
  setBody: (body: string) => void
  footer?: ReactNode | ReactNode[]
  setFooter: (footer: ReactNode | ReactNode[]) => void
}

export const useModal = () => {
  const [header, setHeader] = useState<string>()
  const [body, setBody] = useState<string>()
  const [footer, setFooter] = useState<ReactNode | ReactNode[]>()

  return {
    header,
    setHeader,
    body,
    setBody,
    footer,
    setFooter,
  } as Context
}

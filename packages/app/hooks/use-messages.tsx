'use client'
import useSWR, { KeyedMutator } from 'swr'
import {
  ChatMessage,
  Conversation,
  Member,
  Message,
  MessageStatusType,
  User,
  UserMessages,
} from 'lib/models'
import { putJSON, JsonFetcher } from 'lib/utils'
import { useState, useEffect, createContext, ReactNode, useContext } from 'react'

export type MessagesContextData = {
  conversations: { [key: string]: Conversation }
  hasNewMessages: boolean
  newMessageCount: number
  error?: any
  markAsRead: (ids: string[]) => Promise<void>
  clear: (cid: string) => Promise<void>
  delete: (id: string) => Promise<void>
  loading: boolean
  reload: () => void
  mutate: KeyedMutator<UserMessages>
}

export const MessagesContext = createContext<MessagesContextData>({
  conversations: {},
  hasNewMessages: false,
  newMessageCount: 0,
  markAsRead: async (_) => {},
  clear: async () => {},
  delete: async () => {},
  loading: true,
  reload: () => {},
  mutate: async () => ({}),
})

export function MessagesProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const key = `/api/member/messages`
  const {
    data: userMessages = {},
    mutate,
    error,
    isLoading,
  } = useSWR<UserMessages, Error>(key, JsonFetcher, {
    refreshInterval: 1000 * 30, // 1 minutes
    fallbackData: {},
  })

  const conversations: { [key: string]: Conversation } = {}

  let newMessages = 0
  Object.keys(userMessages || {}).forEach((k) => {
    const messages = userMessages[k].map((m: ChatMessage) => {
      return {
        ...m,
        timestamp: new Date(m.timestamp as string),
      }
    })
    const hasNewMessages = messages.filter((m: { status: string }) => m.status === 'new').length > 0
    const newMessageCount = messages.filter(
      (m: ChatMessage) => m.status === 'new' && m.direction === 'incoming'
    ).length
    newMessages += newMessageCount
    const lastMessage = messages[messages.length - 1]
    const user = lastMessage.user
    conversations[k] = {
      id: k,
      messages,
      newMessageCount,
      lastMessage,
      hasNewMessages,
      user: {
        ...user,
        picture: `/api/asset/${user.picture}?w=100&h=100&fit=crop`,
      },
    }
  })

  const mark = async (ids: string[], status: MessageStatusType) => {
    const { success, data } = await putJSON<any, UserMessages>(key, {
      ids,
      status,
    })
    if (success) {
      mutate(data)
    }
  }

  const context: MessagesContextData = {
    conversations,
    hasNewMessages: newMessages > 0,
    newMessageCount: newMessages,
    error,
    markAsRead: (ids: string[]) => mark(ids, 'read'),
    delete: (id: string) => mark([id], 'archived'),
    clear: (cid: string) =>
      mark(
        conversations[cid].messages.map((m) => m.id),
        'archived'
      ),
    loading: isLoading,
    reload: () => {
      mutate(userMessages, {
        revalidate: true,
      })
    },
    mutate,
  }
  return <MessagesContext.Provider value={context}>{children}</MessagesContext.Provider>
}

export const useMessages = () => useContext(MessagesContext)

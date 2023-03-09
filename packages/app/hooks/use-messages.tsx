'use client'
import useSWR from 'swr'
import { Conversation, Member, Message, MessageStatusType, User, UserMessages } from 'lib/models'
import { putJSON, JsonFetcher } from 'lib/utils'
import { useState, useEffect, createContext, ReactNode, useContext } from 'react'

export type MessagesContextData = {
  conversations: Conversation[]
  hasMessages: boolean
  messageCount: number
  hasNewMessages: boolean
  newMessageCount: number
  error?: any
  markAsRead: (id: string) => Promise<void>
  delete: (id: string) => Promise<void>
  loading: boolean
  reload: () => void
}

export const MessagesContext = createContext<MessagesContextData>({
  conversations: [],
  hasMessages: false,
  messageCount: 0,
  hasNewMessages: false,
  newMessageCount: 0,
  markAsRead: async (_) => {},
  delete: async () => {},
  loading: true,
  reload: () => {},
})

export function MessagesProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const key = `/api/member/messages`
  const {
    data: messages = {},
    mutate,
    error,
    isLoading,
  } = useSWR<UserMessages, Error>(key, JsonFetcher, {
    refreshInterval: 1000 * 60 * 1, // 3 minutes
    fallbackData: {},
  })
  //const [hasNewMessages, setHasNewMessages] = useState<boolean>(undefined)

  ///useEffect(() => {
  //if (!isLoading && hasNewMessages == undefined) {
  //  setHasNewMessages(newMessages.length > 0)
  //}
  ///}, [messages, isLoading, newMessages?.length, hasNewMessages])
  const conversations: Conversation[] = []

  Object.keys(messages).forEach((k) => {
    const conversationMessages = messages[k]
    const hasNewMessages =
      conversationMessages.filter((m: { status: string }) => m.status === 'new').length > 0
    const newMessageCount = conversationMessages.filter(
      (m: { status: string }) => m.status === 'new'
    ).length
    const lastMessage = conversationMessages[conversationMessages.length - 1]
    const user = lastMessage.user
    conversations.push({
      id: k,
      messages: conversationMessages,
      hasNewMessages,
      newMessageCount,
      lastMessage,
      user: {
        ...user,
        picture: `/api/asset/${user.picture}?w=100&h=100&fit=crop`,
      },
    })
  })

  const allMessages = Object.keys(conversations).reduce((acc, k) => {
    return acc.concat(conversations[k].messages)
  }, [])
  const newMessages = allMessages.filter((m) => m.status === 'new')

  const mark = async (id: string, state: MessageStatusType) => {
    const { success, data } = await putJSON(key, {
      id,
      state,
    })
    if (success) {
      mutate()
    }
  }

  const context: MessagesContextData = {
    conversations,
    hasMessages: allMessages.length > 0,
    messageCount: allMessages.length,
    hasNewMessages: newMessages.length > 0,
    newMessageCount: newMessages.length,
    error,
    markAsRead: (id: string) => mark(id, 'read'),
    delete: (id: string) => mark(id, 'archived'),
    loading: isLoading,
    reload: () => {
      mutate()
    },
  }
  return <MessagesContext.Provider value={context}>{children}</MessagesContext.Provider>
}

export const useMessages = () => useContext(MessagesContext)

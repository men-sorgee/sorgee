'use client'
import useSWR, { KeyedMutator } from 'swr'
import { ChatMessage, ChatConversation, Member, MessageStatusType, UserMessages } from 'lib/models'
import { putJSON, JsonFetcher } from 'lib/utils'
import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
} from 'react'

import useCookie from 'react-use-cookie'

export type MessagesContextData = {
  activeId?: string
  lastActiveId?: string
  setActiveId: (cid: string) => void
  chatWith: (user: Partial<Member>) => void
  activeConversation?: ChatConversation
  conversations: ChatConversation[]
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
  activeId: null,
  setActiveId: (_) => {},
  lastActiveId: null,
  chatWith: (_: Partial<Member>) => {},
  activeConversation: null,
  conversations: [],
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

  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [hasNewMessages, setHasNewMessages] = useState(undefined)
  const [activeConversation, setActiveConversation] = useState<ChatConversation>(undefined)
  const [newMessages, setNewMessages] = useState<number>(undefined)
  const [activeId, setActiveId] = useState<string>(undefined)
  const [lastActiveId, setLastActiveId] = useCookie('last-active-conversation')

  useEffect(() => {
    let totalNewMessages = []
    let convos: ChatConversation[] = []
    Object.keys(userMessages || {}).forEach((k) => {
      const messages = userMessages[k]
        .filter((m) => m.status != 'archived')
        .map((m: ChatMessage) => {
          return {
            ...m,
            timestamp: new Date(m.timestamp as string),
          }
        })

      const newMessages = messages.filter(
        (m: ChatMessage) => m.status === 'new' && m.direction === 'incoming'
      )
      const hasNewMessages = newMessages.length > 0
      const newMessageCount = newMessages.length
      const lastMessage = messages[messages.length - 1]
      const user = lastMessage.user
      convos.push({
        id: k,
        messages,
        newMessageCount,
        lastMessage,
        hasNewMessages,
        user: {
          ...user,
          picture: `/api/asset/${user.picture}?w=100&h=100&fit=crop`,
        },
      })
      // @ts-ignore
      setConversations(convos.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp))
      totalNewMessages.push(...newMessages)
    })

    setNewMessages(totalNewMessages.length)
    setHasNewMessages(totalNewMessages.length > 0)
  }, [hasNewMessages, newMessages, userMessages])

  const chatWith = useCallback(
    (user: Partial<Member>) => {
      // create empty conversation
      const convo = conversations?.find((c) => c.user.id == user.id)

      setConversations([
        {
          id: user.id,
          messages: [],
          newMessageCount: 0,
          lastMessage: null,
          hasNewMessages: false,
          user: {
            id: user.id,
            nickname: user.nickname,
            presence: user.presence,
            last_login: user.last_login,
            picture: user.picture && `/api/asset/${user.picture}?w=100&h=100&fit=crop`,
          },
        },
        ...conversations,
      ])
      setActiveId(user.id)
      setActiveConversation(convo)
    },
    [conversations, setActiveId]
  )

  const mark = useCallback(
    async (ids: string[], status: MessageStatusType) => {
      const { success, data } = await putJSON<any, UserMessages>(key, {
        ids,
        status,
      })
      if (success) {
        mutate(data)
      }
    },
    [key, mutate]
  )

  useEffect(() => {
    if (activeId != undefined && activeId != null) {
      const convo = conversations.find((c) => c.id == activeId)
      setActiveConversation(convo)
      setLastActiveId(activeId)
    }
  }, [activeId, conversations, lastActiveId, setLastActiveId])

  const context: MessagesContextData = {
    activeId,
    setActiveId,
    lastActiveId,
    conversations,
    activeConversation,
    chatWith,
    hasNewMessages,
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

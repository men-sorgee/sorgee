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
import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
} from 'react'

export type MessagesContextData = {
  activeConversation?: string
  setActiveConversation: (cid: string) => void
  chatWith: (user: Partial<Member>) => void
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
  activeConversation: null,
  setActiveConversation: (_) => {},
  chatWith: (_: Partial<Member>) => {},
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

  const [conversations, setConversations] = useState<Record<string, Conversation>>({})
  const [hasNewMessages, setHasNewMessages] = useState(undefined)
  const [activeConversation, setActiveConversation] = useState<string>(undefined)
  const [newMessages, setNewMessages] = useState<number>(undefined)
  useEffect(() => {
    let totalNewMessages = []
    Object.keys(userMessages || {}).forEach((k) => {
      const messages = userMessages[k].map((m: ChatMessage) => {
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
      totalNewMessages.push(...newMessages)
    })

    setNewMessages(totalNewMessages.length)
    setHasNewMessages(totalNewMessages.length > 0)
  }, [conversations, hasNewMessages, newMessages, userMessages])

  const chatWith = useCallback(
    (user: Partial<Member>) => {
      // create empty conversation
      if (!conversations[user.id])
        setConversations({
          [user.id]: {
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
        })
      setActiveConversation(user.id)
    },
    [conversations]
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

  const context: MessagesContextData = {
    activeConversation,
    setActiveConversation,
    conversations,
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

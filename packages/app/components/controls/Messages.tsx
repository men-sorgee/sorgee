import { postJSON } from 'lib/utils'
import { useMessages } from 'hooks'
import { Member, ChatMessage, Message, Conversation, UserMessages } from 'lib/models'
import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  Avatar,
  MainContainer,
  Sidebar,
  ConversationList,
  Conversation as ConversationCtrl,
  MessageGroup,
  Message as MessageCtrl,
  ChatContainer,
  ConversationHeader,
  MessageList,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react'
import io, { Socket } from 'socket.io-client'
import MessagesStyles from './MessagesStyles'

let socket: Socket

export const Messages = ({ currentUser }: { currentUser: Member }) => {
  const { conversations, markAsRead, reload, mutate, activeConversation: a } = useMessages()
  const [cId, setCid] = useState<string>(a)
  const [activeConversation, setActiveConversation] = useState<Conversation>()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [sidebarStyle, setSidebarStyle] = useState({})
  const [chatContainerStyle, setChatContainerStyle] = useState({})
  const [conversationContentStyle, setConversationContentStyle] = useState({})
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({})

  const handleBackClick = () => {
    setSidebarVisible(!sidebarVisible)
    setCid(null)
  }

  const handleConversationClick = useCallback(
    (cid: string) => {
      if (sidebarVisible) {
        setSidebarVisible(false)
      }
      setCid(cid)
    },
    [sidebarVisible, setSidebarVisible]
  )

  useEffect(() => {
    if (sidebarVisible) {
      setSidebarStyle({
        display: 'flex',
        flexBasis: 'auto',
        width: '100%',
        maxWidth: '100%',
      })
      setConversationContentStyle({
        display: 'flex',
      })
      setConversationAvatarStyle({
        marginRight: '1em',
      })
      setChatContainerStyle({
        display: 'none',
      })
    } else {
      setSidebarStyle({})
      setConversationContentStyle({})
      setConversationAvatarStyle({})
      setChatContainerStyle({})
    }
  }, [
    sidebarVisible,
    setSidebarVisible,
    setConversationContentStyle,
    setConversationAvatarStyle,
    setSidebarStyle,
    setChatContainerStyle,
  ])

  useEffect(() => {
    if (socket == undefined) return socketInitializer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!conversations) return
    if (cId !== undefined) {
      setActiveConversation(conversations[cId])
      setMessages(conversations[cId]?.messages)
    } else {
      const keys = Object.keys(conversations)
      if (keys.length > 0) {
        setCid(keys[0])
      }
    }
  }, [activeConversation, cId, conversations])

  const audioRef = useRef<HTMLAudioElement>(null)

  const socketInitializer = () => {
    fetch('/api/socket').catch((err) => {
      console.log(err)
    })
    socket = io({
      path: '/api/socket.io',
      addTrailingSlash: false,
    })
    socket.on('connect', () => {
      socket.emit('join', currentUser.id)
    })
    socket.on('receive-message', (message: ChatMessage) => {
      receiveMessage(message)
      audioRef.current?.play()
    })
    socket.on('user-typing', (from: string) => {
      if (from == cId) {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
        }, 1000)
      }
    })
    return () => {
      socket.disconnect()
    }
  }

  const receiveMessage = useCallback(
    (message: ChatMessage) => {
      if (message.user.id == cId) {
        setMessages((messages) => [
          ...messages,
          {
            ...message,
            direction: 'incoming',
          },
        ])
      }
    },
    [cId]
  )

  // Get current user data
  const [convoUserAvatar, convoUserName] = useMemo(() => {
    if (activeConversation) {
      const { user } = activeConversation

      if (user) {
        return [
          <Avatar
            key={user?.id}
            id={user?.id}
            src={user.picture ? user.picture : undefined}
            name={user?.nickname}
          />,
          user.nickname,
        ]
      }
    }

    return [undefined, undefined]
  }, [activeConversation])

  const userTyping = useCallback(() => {
    if (socket) {
      socket.emit('user-typing', {
        to: cId,
        from: currentUser.id,
      })
    }
  }, [cId, currentUser.id])

  const handleInputChange = (e) => {
    //setInputValue(e.target.value)
    userTyping()
  }

  const typingIndicator = useMemo(() => {
    if (isTyping) {
      return <TypingIndicator content="Typing..." />
    }
    return null
  }, [isTyping])

  const handleSend = (text: string) => {
    sendMessage({
      body: text,
      type: 'text',
      user: {
        id: currentUser.id,
        nickname: currentUser.nickname,
        picture: currentUser.picture as string,
        last_login: currentUser.last_login,
        presence: currentUser.presence,
      },
    })
  }

  const handleAttachment = async (args) => {
    //let formData = new FormData()
    //formData.append('media', file)
    //const query = `?name=messaged-from-${currentUser.email}&title=to-${currentUserName}`
    //const res = await fetch(`/api/member/${currentUser.id}/photo/` + query, {
    //  method: 'POST',
    //  body: formData,
    //})
  }
  const inputRef = useRef()
  const sendMessage = useCallback(
    ({ body, image, type }: Partial<ChatMessage>) => {
      const user = {
        id: currentUser.id,
        nickname: currentUser.nickname,
        picture: currentUser.picture as string,
        last_login: currentUser.last_login,
        presence: currentUser.presence,
      }
      setMessages([
        ...messages,
        {
          type,
          body,
          image,
          direction: 'outgoing',
          user,
        } as ChatMessage,
      ])
      postJSON<Message>('/api/member/messages', {
        body,
        image,
        type,
        to: cId,
        from: currentUser.id,
      } as Message).then(({ data }) => {
        const { type, body, image, date_created } = data
        socket.emit('send-message', {
          type,
          body,
          image,
          direction: 'outgoing',
          user,
          timestamp: date_created,
        })
      })
    },
    [
      cId,
      currentUser.id,
      currentUser.last_login,
      currentUser.nickname,
      currentUser.picture,
      currentUser.presence,
      messages,
    ]
  )

  const messagesSeen = useCallback(() => {
    if (activeConversation) {
      markAsRead(
        conversations[cId].messages
          .filter((m) => m.direction == 'incoming' && m.status == 'new')
          .map((m) => m.id)
      )
      mutate()
    }
  }, [activeConversation, cId, conversations, markAsRead, mutate])

  return (
    <>
      <MessagesStyles />
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />

      <MainContainer responsive className="bg" style={{}}>
        <Sidebar position="left" style={sidebarStyle}>
          <ConversationList>
            {Object.values(conversations).map((c) => {
              // Helper for getting the data of the first participant
              const {
                id,
                user: { nickname, picture },
                newMessageCount,
                messages,
              } = c
              const lastMessage = messages.length ? messages[messages.length - 1] : null
              const lastMessageDate = lastMessage
                ? formatDistanceToNow(lastMessage?.timestamp as Date)
                : 'now'
              return (
                <ConversationCtrl
                  key={id}
                  name={nickname}
                  active={activeConversation?.id === id}
                  onClick={() => {
                    handleConversationClick(id)
                  }}
                  lastActivityTime={lastMessageDate ? lastMessageDate : 'Just now'}
                  unreadDot={newMessageCount > 0}
                >
                  <Avatar
                    key={id}
                    id={id}
                    src={picture ? picture : null}
                    name={nickname}
                    style={conversationAvatarStyle}
                  />
                </ConversationCtrl>
              )
            })}
          </ConversationList>
        </Sidebar>
        <ChatContainer
          onFocus={() => {
            messagesSeen()
          }}
          style={chatContainerStyle}
        >
          {cId && (
            <ConversationHeader>
              <ConversationHeader.Back onClick={handleBackClick} />
              {convoUserAvatar}
              <ConversationHeader.Content
                userName={convoUserName}
                style={conversationContentStyle}
                info={activeConversation?.user?.presence}
              />
              <ConversationHeader.Actions></ConversationHeader.Actions>
            </ConversationHeader>
          )}

          <MessageList scrollBehavior="auto" typingIndicator={typingIndicator}>
            {cId &&
              messages?.map((m, i) => (
                <MessageGroup key={i} direction={m.direction}>
                  <MessageGroup.Messages>
                    <MessageCtrl
                      model={{
                        type: 'text',
                        payload: m.body,
                        direction: m.direction,
                        position: 'single',
                      }}
                    />
                  </MessageGroup.Messages>
                </MessageGroup>
              ))}
          </MessageList>

          <MessageInput
            attachButton={false}
            onAttachClick={handleAttachment}
            onSend={handleSend}
            onChange={handleInputChange}
            ref={inputRef}
            autoFocus
            placeholder="Type message here"
          />
        </ChatContainer>
      </MainContainer>
    </>
  )
}

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
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

let socket: Socket

const Chat = ({ currentUser }: { currentUser: Member }) => {
  // Message input value

  // Get all chat related values and methods from useChat hook

  const { conversations, markAsRead, reload, mutate } = useMessages()
  const [cId, setCid] = useState<string>()
  const [activeConversation, setActiveConversation] = useState<Conversation>()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!conversations) return
    if (cId !== undefined) {
      setActiveConversation(conversations[cId])
      setMessages(conversations[cId].messages)
      markAsRead(conversations[cId].messages.map((m) => m.id))
    }
  }, [activeConversation, cId, conversations, markAsRead, reload])

  const socketInitializer = () => {
    fetch('/api/socket').catch((err) => {
      console.log(err)
    })
    socket = io()
    socket.on('connect', () => {
      socket.emit('join', currentUser.id)
    })
    socket.on('receive-message', (message: ChatMessage) => {
      receiveMessage()
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

  const receiveMessage = useCallback(reload, [reload])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => socketInitializer(), [])

  // Get current user data
  const [currentUserAvatar, currentUserName] = useMemo(() => {
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
    console.dir(args)
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
      setInputValue('')
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

  return (
    <MainContainer
      className="bg"
      css={{
        svg: {
          minHeight: '1.5rem',
          color: 'black',
        },
      }}
    >
      <Sidebar position="left">
        <ConversationList>
          {Object.values(conversations).map((c) => {
            // Helper for getting the data of the first participant
            const {
              id,
              user: { nickname, picture },
              newMessageCount,
              messages,
            } = c
            const lastMessage = messages[messages.length - 1]
            const lastMessageText = lastMessage?.body
            const lastMessageDate = formatDistanceToNow(lastMessage?.timestamp as Date)
            return (
              <ConversationCtrl
                key={id}
                name={nickname}
                active={activeConversation?.id === id}
                unreadCnt={newMessageCount}
                onClick={(e) => setCid(c.id)}
                lastActivityTime={lastMessageDate}
                info={lastMessageText}
                lastSenderName={nickname}
                unreadDot={newMessageCount > 0}
              >
                <Avatar key={id} id={id} src={picture ? picture : null} name={nickname} />
              </ConversationCtrl>
            )
          })}
        </ConversationList>
      </Sidebar>

      {cId && (
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back onClick={() => setCid(null)} />
            {currentUserAvatar}
            <ConversationHeader.Content userName={currentUserName} />
            <ConversationHeader.Actions></ConversationHeader.Actions>
          </ConversationHeader>

          <MessageList scrollBehavior="smooth" typingIndicator={typingIndicator}>
            {messages.map((m, i) => (
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
            onAttachClick={handleAttachment}
            onSend={handleSend}
            onChange={handleInputChange}
            ref={inputRef}
            autoFocus
            placeholder="Type message here"
          />
        </ChatContainer>
      )}
    </MainContainer>
  )
}

export default Chat

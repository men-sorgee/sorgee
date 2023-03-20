import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { postJSON } from 'lib/utils'
import { useMessages } from 'hooks'
import { Member, ChatMessage, Message, Conversation, UserMessages } from 'lib/models'
import { useState, useMemo, useCallback, useEffect } from 'react'
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
  useEffect(() => {
    if (!conversations || conversations.length == 0) return
    if (cId == undefined) {
      setCid(conversations[0].id)
      setActiveConversation(conversations[0])
      setMessages(conversations[0].messages)
      markAsRead(conversations[0].messages.map((m) => m.id))
    } else if (activeConversation && cId != activeConversation.id) {
      reload()
      const c = conversations.find((c) => c.id == cId)
      setActiveConversation(c)
      setMessages(c.messages)
      markAsRead(c.messages.map((m) => m.id))
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
      const convo = [...conversations[message.user.id].messages, message]
      const userMessages: UserMessages = {
        [message.user.id]: convo,
      }
      Object.keys(conversations).forEach((k) => {
        if (k != message.user.id) {
          userMessages[k] = conversations[k].messages
        }
      })
      mutate(userMessages, {
        revalidate: true,
      })
    })
    return () => {
      socket.disconnect()
    }
  }

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
            src={user.picture}
            name={user?.nickname}
            active={user.presence == 'online'}
          />,
          user.nickname,
        ]
      }
    }

    return [undefined, undefined]
  }, [activeConversation])

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
        to: activeConversation?.user.id,
        from: currentUser.id,
      } as Message).then((res) => {
        const { type, body, image } = res.data
        socket.emit('send-message', {
          type,
          body,
          image,
          direction: 'outgoing',
          user,
        })
      })
    },
    [
      activeConversation?.user.id,
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
          {conversations?.map((c) => {
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
                <Avatar key={id} id={id} src={picture} name={nickname} />
              </ConversationCtrl>
            )
          })}
        </ConversationList>
      </Sidebar>

      <ChatContainer>
        <ConversationHeader>
          {currentUserAvatar}
          <ConversationHeader.Content userName={currentUserName} />
          <ConversationHeader.Actions></ConversationHeader.Actions>
        </ConversationHeader>

        <MessageList>
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
          autoFocus
          placeholder="Type message here"
        />
      </ChatContainer>
    </MainContainer>
  )
}

export default Chat

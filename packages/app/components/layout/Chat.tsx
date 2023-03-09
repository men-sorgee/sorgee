import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { getAssetUrl, postJSON } from 'lib/utils'
import { MessagesContext, useMessages } from 'hooks'
import { Member, Message as Msg, Conversation as Cnvs } from 'lib/models'
import { useState, useMemo, useCallback } from 'react'
import {
  MainContainer,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar,
  MessageGroup,
  Message,
  ChatContainer,
  ConversationHeader,
  MessageList,
  MessageInput,
} from '@chatscope/chat-ui-kit-react'

import { nanoid } from 'nanoid'

const Chat = ({ currentUser }: { currentUser: Member }) => {
  // Message input value
  const [value, setValue] = useState('')
  const [activeConversation, setActiveConversation] = useState<Cnvs>()
  const [messages] = useState<Msg[]>(activeConversation?.messages || [])
  // Get all chat related values and methods from useChat hook
  const { conversations } = useMessages()

  const sendMessage = useCallback((message: Partial<Msg>) => {
    postJSON<Partial<Msg>>('/api/member/messages', message).then((res) => {
      console.log(res)
    })
  }, [])

  // Get current user data
  const [currentUserAvatar, currentUserName] = useMemo(() => {
    if (activeConversation) {
      const { user } = activeConversation

      if (user) {
        return [<Avatar key={user.id} src={user.picture} />, user.nickname]
      }
    }

    return [undefined, undefined]
  }, [activeConversation])

  const handleSend = (text: string) => {
    sendMessage({
      body: text,
      to: activeConversation?.user.id,
      from: currentUser.id,
    })
  }

  return (
    <MainContainer>
      <Sidebar position="left">
        <ConversationList>
          {conversations?.map((c) => {
            // Helper for getting the data of the first participant
            const [avatar, name] = (() => {
              const { user } = c
              if (user) {
                return [<Avatar key={user.id} src={user.picture} />, user.nickname]
              }

              return [undefined, undefined]
            })()

            return (
              <Conversation
                key={c.id}
                name={name}
                active={activeConversation?.id === c.id}
                unreadCnt={c.newMessageCount}
                onClick={(e) => setActiveConversation(c)}
              >
                {avatar}
              </Conversation>
            )
          })}
        </ConversationList>
      </Sidebar>

      <ChatContainer>
        <ConversationHeader>
          {currentUserAvatar}
          <ConversationHeader.Content userName={currentUserName} />
        </ConversationHeader>

        <MessageList>
          {messages.map((m) => (
            <MessageGroup key={m.id} direction={m.direction}>
              <MessageGroup.Messages>
                <Message
                  key={m.id}
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

        <MessageInput value={value} onSend={handleSend} />
      </ChatContainer>
    </MainContainer>
  )
}

export default Chat

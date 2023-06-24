import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { formatDistanceToNow } from 'date-fns'
import { useMessages } from 'hooks'
import { ChatMessage, Member, Message } from 'lib/models'
import { postJSON } from 'lib/utils'
import io, { Socket } from 'socket.io-client'

import { IconButton, useDisclosure } from '@chakra-ui/react'
import {
  Avatar,
  ChatContainer,
  Conversation as ConversationCtrl,
  ConversationHeader,
  ConversationList,
  MainContainer,
  Message as MessageCtrl,
  MessageGroup,
  MessageInput,
  MessageList,
  Sidebar,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react'
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

import {
  MemberConnect,
  MemberModal,
  MemberLike,
  MemberShare,
  MemberBlock
} from './'

import MessagesStyles from './MessagesStyles'

let socket: Socket

export const Messages = ({ member }: { member: Member }) => {
  const {
    conversations,
    activeConversation,
    markAsRead,
    mutate,
    activeId,
    setActiveId,
    delete: d
  } = useMessages()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [sidebarStyle, setSidebarStyle] = useState({})
  const [chatContainerStyle, setChatContainerStyle] = useState({})
  const [conversationContentStyle, setConversationContentStyle] = useState({})
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({})

  const handleBackClick = () => {
    setSidebarVisible(!sidebarVisible)
    setActiveId(null)
  }

  const handleConversationClick = useCallback(
    (activeId: string) => {
      if (sidebarVisible) {
        setSidebarVisible(false)
      }
      setActiveId(activeId)
    },
    [sidebarVisible, setActiveId]
  )

  useEffect(() => {
    if (sidebarVisible) {
      setSidebarStyle({
        display: 'flex',
        flexBasis: 'auto',
        width: '100%',
        maxWidth: '100%'
      })
      setConversationContentStyle({
        display: 'flex'
      })
      setConversationAvatarStyle({
        marginRight: '1em'
      })
      setChatContainerStyle({
        display: 'none'
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
    activeId,
    setActiveId,
    conversations
  ])

  useEffect(() => {
    if (socket == undefined) return socketInitializer()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const audioRef = useRef<HTMLAudioElement>(null)

  const socketInitializer = () => {
    fetch('/api/socket').catch((err) => {
      console.error(err)
    })
    socket = io({
      path: '/api/socket.io',
      addTrailingSlash: false
    })
    socket.on('connect', () => {
      socket.emit('join', member?.id)
    })
    socket.on('receive-message', (message: ChatMessage) => {
      receiveMessage(message)
    })
    socket.on('user-typing', (from: string) => {
      if (from == activeId) {
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
  const messagesSeen = useCallback(() => {
    if (activeConversation) {
      markAsRead(
        activeConversation.messages
          .filter((m) => m.direction == 'incoming' && m.status == 'new')
          .map((m) => m.id)
      )
      mutate()
    }
  }, [activeConversation, markAsRead, mutate])

  const receiveMessage = useCallback(
    (message: ChatMessage) => {
      audioRef.current?.play()
      if (message.user.id == activeId) {
        setMessages((messages) => [
          ...messages,
          {
            ...message,
            direction: 'incoming'
          }
        ])
        messagesSeen()
      }
    },
    [activeId, messagesSeen]
  )
  const { isOpen, onClose, onOpen } = useDisclosure()
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
            status={user?.presence == 'online' ? 'available' : 'unavailable'}
            active={user?.presence == 'online'}
            aria-label="View Profile"
            onClick={onOpen}
            title="View Profile"
            style={{
              cursor: 'pointer'
            }}
          />,
          user?.nickname
        ]
      }
    }

    return [undefined, undefined]
  }, [activeConversation, onOpen])

  const userTyping = useCallback(() => {
    if (socket) {
      socket.emit('user-typing', {
        to: activeId,
        from: member?.id
      })
    }
  }, [activeId, member?.id])

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

  function decodeHtml(html: string) {
    var txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }

  const handleSend = (innerHtml: string) => {
    sendMessage({
      body: innerHtml,
      type: 'html',
      timestamp: new Date(),
      user: {
        id: member?.id,
        nickname: member?.nickname,
        picture: member?.picture as string,
        last_login: member?.last_login,
        presence: member?.presence
      }
    })
  }
  const [inputValue, setInputValue] = useState('')
  const [previewSrc, setPreviewSrc] = useState<string>(undefined)
  const handleAttachment = async (file: File) => {}

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewSrc(URL.createObjectURL(file))

      let formData = new FormData()
      formData.append('media', file)

      handleAttachment(file)
    }
  }
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef()
  const sendMessage = useCallback(
    ({ body, image, type, timestamp }: Partial<ChatMessage>) => {
      const user = {
        id: member?.id,
        nickname: member?.nickname,
        picture: member?.picture as string,
        last_login: member?.last_login,
        presence: member?.presence
      }
      setMessages([
        ...messages,
        {
          type,
          body,
          image,
          timestamp,
          direction: 'outgoing',
          user
        } as ChatMessage
      ])
      postJSON<Message>('/api/member/messages', {
        body,
        image,
        type,
        to: activeId,
        from: member?.id
      } as Message).then(({ data }) => {
        const { type, body, image, date_created } = data
        socket.emit('send-message', activeId, {
          type,
          body,
          image,
          user,
          timestamp: new Date(date_created).toISOString()
        })
      })
    },
    [
      activeId,
      member?.id,
      member?.last_login,
      member?.nickname,
      member?.picture,
      member?.presence,
      messages
    ]
  )

  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages)
    } else {
      setActiveId(conversations[0]?.id)
    }
  }, [activeConversation, conversations, setActiveId])

  return (
    <>
      <MessagesStyles />
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />

      <MainContainer responsive className="bg" style={{}}>
        <Sidebar position="left" style={sidebarStyle}>
          <ConversationList>
            {conversations.map((c) => {
              // Helper for getting the data of the first participant
              const {
                id,
                user: { nickname, picture, presence },
                newMessageCount,
                messages
              } = c
              const lastMessage = messages.length
                ? messages[messages.length - 1]
                : null
              const lastMessageDate = lastMessage
                ? formatDistanceToNow(lastMessage?.timestamp as Date) + ' ago'
                : 'now'
              return (
                <ConversationCtrl
                  key={id}
                  name={nickname}
                  active={activeConversation?.id === id}
                  onClick={() => {
                    handleConversationClick(id)
                  }}
                  lastActivityTime={
                    lastMessageDate ? lastMessageDate : 'Just now'
                  }
                  unreadDot={newMessageCount > 0}
                >
                  <Avatar
                    key={id}
                    id={id}
                    src={picture ? picture : null}
                    name={nickname}
                    style={conversationAvatarStyle}
                    status={presence == 'online' ? 'available' : 'unavailable'}
                    active={presence == 'online'}
                  />
                </ConversationCtrl>
              )
            })}
          </ConversationList>
        </Sidebar>
        {activeId && (
          <ChatContainer
            onFocus={() => {
              messagesSeen()
            }}
            style={chatContainerStyle}
          >
            <ConversationHeader>
              <ConversationHeader.Back onClick={handleBackClick} />
              {convoUserAvatar}
              <ConversationHeader.Content
                userName={convoUserName}
                style={conversationContentStyle}
                info={activeConversation?.user?.presence}
              />
              <ConversationHeader.Actions>
                <MemberBlock size="sm" member={activeConversation?.user} />
                <MemberLike size="sm" member={activeConversation?.user} />
                <MemberConnect size="sm" member={activeConversation?.user} />
                <MemberShare size="sm" member={activeConversation?.user} />
              </ConversationHeader.Actions>
            </ConversationHeader>

            <MessageList
              scrollBehavior="auto"
              typingIndicator={typingIndicator}
            >
              {activeId &&
                messages.map((m, i) => (
                  <MessageGroup key={i} direction={m.direction}>
                    <MessageGroup.Messages>
                      <MessageCtrl
                        model={{
                          type: m.type,
                          payload: decodeHtml(m.body),
                          direction: m.direction,
                          position: 'single'
                        }}
                      >
                        {m.direction == 'outgoing' && (
                          <MessageCtrl.Header
                            style={{
                              flexDirection: 'row-reverse'
                            }}
                          >
                            <IconButton
                              variant={'ghost'}
                              position={'absolute'}
                              float={'right'}
                              aria-label="Delete"
                              title="Delete"
                              icon={<XMarkIcon fill={'white'} width={10} />}
                              onClick={() => d(m.id)}
                              size="xs"
                              color={'white'}
                              m={1}
                              opacity={0.2}
                              _hover={{
                                bg: 'secondary.500',
                                opacity: 1
                              }}
                            />
                          </MessageCtrl.Header>
                        )}

                        <MessageCtrl.Footer
                          style={{
                            display: 'block',
                            textAlign:
                              m.direction == 'outgoing' ? 'right' : 'left'
                          }}
                          sentTime={
                            formatDistanceToNow(m.timestamp as Date) + ' ago'
                          }
                        ></MessageCtrl.Footer>
                      </MessageCtrl>
                    </MessageGroup.Messages>
                  </MessageGroup>
                ))}
              {typingIndicator}
            </MessageList>

            <MessageInput
              attachButton={false}
              onAttachClick={() => {
                fileInputRef.current.click()
              }}
              onSend={handleSend}
              onChange={handleInputChange}
              ref={inputRef}
              autoFocus
              placeholder="Type message here"
              content={inputValue}
            ></MessageInput>
          </ChatContainer>
        )}
      </MainContainer>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <MemberModal memberId={activeId} isOpen={isOpen} onClose={onClose} />
    </>
  )
}

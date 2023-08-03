'use client'
import { useMessages, useUser } from 'hooks'
import {
  MemberBlock,
  MemberModal,
  MemberReport,
  MemberShare,
  Page
} from 'components'
import { useDisclosure, Flex, HStack, IconButton } from '@chakra-ui/react'
import {
  Avatar,
  Message as MessageCtrl,
  ChatContainer,
  Conversation as ConversationCtrl,
  ConversationHeader,
  ConversationList,
  MainContainer,
  MessageGroup,
  MessageInput,
  MessageList,
  Sidebar,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react'

import { useRouter } from 'next/router'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

import io, { Socket } from 'socket.io-client'
import { userImageId } from 'lib/config'
import { getAssetUrl, postJSON } from 'lib/utils'
import dynamic from 'next/dynamic'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/solid'
import { formatDistanceToNow, set } from 'date-fns'
import { ChatMessage, Message, Member, MemberLevel } from 'lib/models'

const MessagesStyles = dynamic(
  () => import('components/controls/MessagesStyles'),
  { ssr: false }
)

export default function ChatPage({ id }: { id?: string }) {
  const { member, loading } = useUser({
    minLevel: MemberLevel.pledge,
    redirectsEnabled: true
  })
  const [socket, setSocket] = useState<Socket>(undefined)
  const {
    conversations,
    activeConversation,
    markAsRead,
    mutate,
    activeId,
    setActiveId,
    delete: d
  } = useMessages()
  const router = useRouter()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [sidebarStyle, setSidebarStyle] = useState({})
  const [chatContainerStyle, setChatContainerStyle] = useState({})
  const [conversationContentStyle, setConversationContentStyle] = useState({})
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({})

  const { id: i } = router.query
  useEffect(() => {
    if (id) {
      setActiveId(id)
      setSidebarVisible(false)
    } else if (i) {
      setActiveId(i as string)
      setSidebarVisible(false)
    }
  }, [id, i, setActiveId])

  const handleBackClick = useCallback(async () => {
    setActiveId(undefined)
    await router.push('/members/chat')
    setSidebarVisible(true)
  }, [router, setActiveId])

  const handleConversationClick = useCallback(
    async (activeId: string) => {
      setActiveId(undefined)
      if (sidebarVisible) {
        setSidebarVisible(false)
      }
      await router.push(`/members/chat/${activeId}`)
      setActiveId(activeId)
    },
    [router, setActiveId, sidebarVisible]
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
        marginRight: '1em',
        cursor: 'pointer'
      })
      setChatContainerStyle({
        display: 'none'
      })
    } else {
      setSidebarStyle({})
      setConversationContentStyle({})
      setConversationAvatarStyle({ cursor: 'pointer' })
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

  const audioRef = useRef<HTMLAudioElement>(null)

  const messagesSeen = useCallback(() => {
    if (
      activeConversation &&
      activeConversation.messages.filter(
        (m) => m.direction == 'incoming' && m.status == 'new'
      ).length > 0
    ) {
      markAsRead(
        activeConversation.messages
          .filter((m) => m.direction == 'incoming' && m.status == 'new')
          .map((m) => m.id)
      ).then(() => mutate())
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
        setTimeout(() => {
          messagesSeen()
        }, 1000)
      }
    },
    [activeId, messagesSeen]
  )

  const socketInitializer = useCallback(() => {
    fetch('/api/socket').catch((err) => {
      console.error(err)
    })
    let socket = io({
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
        }, 3000)
      }
    })
    setSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [activeId, member?.id, receiveMessage])

  useEffect(() => {
    if (socket == undefined) return socketInitializer()
  }, [socket, socketInitializer])

  const { isOpen, onClose, onOpen } = useDisclosure()

  const userTyping = useCallback(() => {
    if (socket) {
      socket.emit('user-typing', {
        to: activeId,
        from: member?.id
      })
    }
  }, [activeId, member?.id, socket])

  const handleInputChange = (e) => {
    if (e.target?.value) {
      setInputValue(e.target.value)
      userTyping()
    }
  }

  const typingIndicator = useMemo(() => {
    if (isTyping) {
      return <TypingIndicator content="Typing..." />
    }
    return null
  }, [isTyping])

  const decodeHtml = (html: string) => {
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
      postJSON<Message>('/api/my/messages', {
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
      messages,
      socket
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
    <Page
      title="Brother Chat"
      loading={loading}
      hideHeader
      full
      position="relative"
    >
      <MessagesStyles />
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />

      <MainContainer responsive className="bg">
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
                    src={getAssetUrl(picture || userImageId)}
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
        {activeConversation?.user && (
          <ChatContainer
            onFocus={() => {
              messagesSeen()
            }}
            style={chatContainerStyle}
          >
            <ConversationHeader>
              <ConversationHeader.Back onClick={handleBackClick} />
              <Avatar
                key={activeConversation.user.id}
                id={id}
                src={getAssetUrl(
                  activeConversation.user.picture || userImageId
                )}
                name={activeConversation.user.nickname}
                status={
                  activeConversation.user.presence == 'online'
                    ? 'available'
                    : 'unavailable'
                }
                style={{
                  ...conversationAvatarStyle,
                  cursor: 'pointer'
                }}
                active={activeConversation.user.presence == 'online'}
                onClick={() => onOpen()}
              />
              <ConversationHeader.Content
                userName={activeConversation.user.nickname}
                style={conversationContentStyle}
                info={activeConversation?.user?.presence}
              />
              <ConversationHeader.Actions>
                <MemberBlock size="md" member={activeConversation?.user} />
                <MemberReport size="md" member={activeConversation?.user} />
                <MemberShare size="md" member={activeConversation?.user} />
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
                            itemType={m.type}
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
                          itemType={m.type}
                        >
                          <Flex
                            color="text"
                            justify="space-between"
                            align="center"
                            gap={2}
                            pt={1}
                          >
                            {m.status == 'read' &&
                              m.direction == 'outgoing' && (
                                <HStack align="center" spacing={0}>
                                  <CheckIcon
                                    fill={'white'}
                                    width={11}
                                    height={11}
                                    title="Read"
                                  />
                                  <small>read</small>
                                </HStack>
                              )}

                            <small title={m.timestamp.toISOString()}>
                              sent{' '}
                              {formatDistanceToNow(
                                (m.timestamp as Date) || new Date()
                              ) + ' ago'}
                            </small>
                          </Flex>
                        </MessageCtrl.Footer>
                      </MessageCtrl>
                    </MessageGroup.Messages>
                  </MessageGroup>
                ))}
              {typingIndicator}
            </MessageList>

            <MessageInput
              style={{
                marginBlock: '1rem'
              }}
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
      <MemberModal
        memberId={activeId}
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      />
    </Page>
  )
}

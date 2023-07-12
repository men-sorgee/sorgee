import { useCallback, useEffect, useState } from 'react'

import { useUser } from 'hooks'
import { Member } from 'lib/models'
import { postJSON } from 'lib/utils'

import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  IconButton,
  IconButtonProps,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Toast,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { FlagIcon as ReportIcon } from '@heroicons/react/24/outline'
import { FlagIcon as ReportIconHover } from '@heroicons/react/24/solid'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member>
}

export const MemberReport = chakra(
  ({ member, size = ['sm', 'md', 'lg'], ...props }: Props) => {
    const { loading, member: me, reload } = useUser()
    const [hover, setHover] = useState(false)
    const [message, setMessage] = useState<string>('')
    const { isOpen, onClose, onOpen } = useDisclosure()
    const toast = useToast()
    const reportUser = useCallback(() => {
      // add buddy
      postJSON(`/api/member/report/${member.id}`, {
        message
      }).then(() => {
        onClose()
        setMessage('')
        toast({
          title: 'Report Received',
          description: `Thank you for reporting ${member?.nickname}. We will review your report and take appropriate action.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top'
        })
      })
    }, [member?.id, member?.nickname, message, onClose, toast])

    if (loading || !me || me?.id == member?.id) return null
    const label = `Report ${member?.nickname}`
    return (
      <>
        <IconButton
          size={size}
          title={label}
          aria-label={label}
          icon={
            hover ? (
              <ReportIconHover width="30px" fill="red" />
            ) : (
              <ReportIcon width="30px" stroke="white" />
            )
          }
          variant="ghost"
          _hover={{ bg: 'primary.500' }}
          onClick={onOpen}
          {...props}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Report {member?.nickname}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="message">
                <FormLabel>Message</FormLabel>
                <Textarea
                  placeholder="What is the issue?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={reportUser}>
                Report
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
)

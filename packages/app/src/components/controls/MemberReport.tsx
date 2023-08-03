import { useUser } from "hooks";
import { Member, MemberLevel } from "lib/models";
import { postJSON } from "lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
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
  Spinner,
  Textarea,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { FlagIcon as ReportIcon } from "@heroicons/react/24/outline";
import { FlagIcon as ReportIconHover } from "@heroicons/react/24/solid";

import { Loading } from "./Loading";

type Props = Omit<IconButtonProps, 'aria-label'> & {
  member: Partial<Member>
}

export const MemberReport = chakra(
  ({ member, size = ['sm', 'md', 'lg'], ...props }: Props) => {
    const { loading, member: me } = useUser()
    const [hover, setHover] = useState(false)
    const [message, setMessage] = useState<string>('')
    const { isOpen, onClose, onOpen } = useDisclosure()
    const toast = useToast()
    const formRef = useRef<HTMLFormElement>()
    const [working, setWorking] = useState(false)
    const reportUser = useCallback(() => {
      // add buddy
      return postJSON(`/api/members/${member.id}/report`, {
        message
      })
        .then(() => {
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
        .catch((error) => {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top'
          })
        })
    }, [member?.id, member?.nickname, message, onClose, toast])

    if (loading || !me || me?.id == member?.id)
      return <ReportIcon width="30px" stroke="white" />

    if (MemberLevel[member?.user_type || 'applicant'] == MemberLevel.staff)
      return <></>

    const label = `Report ${member?.nickname}`

    if (loading) return <Spinner size="sm" title={label} aria-label={label} />

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
          disabled={me?.id === member?.id}
        />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault()
                setWorking(true)
                if (formRef.current.checkValidity()) {
                  reportUser().then(() => setWorking(false))
                }
              }}
            >
              <ModalHeader>Report {member?.nickname}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {(working && <Loading />) || (
                  <FormControl id="message" isRequired>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                      placeholder="What is the issue?"
                      value={message}
                      required
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <FormErrorMessage>Please enter a message.</FormErrorMessage>
                  </FormControl>
                )}
              </ModalBody>
              <ModalFooter>
                <Button type="submit" colorScheme="blue" mr={3}>
                  Report
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </>
    )
  }
)

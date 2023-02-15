import {
  ButtonProps,
  chakra,
  useToast,
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react'
import { useRef, useCallback } from 'react'
import { ApiResponse } from 'lib/models'

export type ConfirmButtonProps = ButtonProps & {
  request: () => Promise<[boolean, ApiResponse]>
  complete: (bool: boolean, error?: string) => void
  title: string
  confirmMessage: string
  successMessage: string
  failureMessage: string
  children: React.ReactNode
}

export const ConfirmButton = chakra(
  ({
    request,
    complete,
    title,
    confirmMessage,
    successMessage,
    failureMessage,
    children,
    ...props
  }: ConfirmButtonProps) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
    const action = useCallback(() => {
      request().then(([ok, res]) => {
        complete(ok, res.error?.message)
        if (ok) {
          toast({
            title,
            description: successMessage,
            status: 'success',
            duration: 5000,
          })
        } else {
          toast({
            title,
            description: failureMessage + ' ' + res.error.message,
            status: 'error',
            duration: 5000,
          })
        }
      })
    }, [complete, failureMessage, request, successMessage, title, toast])
    return (
      <>
        <Button onClick={onOpen} {...props}>
          {children || 'Delete'}
        </Button>

        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {title}
              </AlertDialogHeader>

              <AlertDialogBody>{confirmMessage}</AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    action()
                    onClose()
                  }}
                  ml={3}
                >
                  {children || 'Delete'}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }
)

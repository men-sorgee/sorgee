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
import { useRef, useCallback, ReactNode, RefObject } from 'react'

export type ConfirmButtonProps = ButtonProps & {
  promise: () => Promise<any>
  complete: (bool: boolean, data: any, error?: string) => void
  title: string
  buttonText: string
  confirmColorScheme?: string
  successMessage: string
  failureMessage: string
  focusRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>
  children: ReactNode | ReactNode[]
}

export const ConfirmButton = chakra(
  ({
    promise,
    complete,
    title,
    buttonText,
    confirmColorScheme = 'red',
    successMessage,
    failureMessage,
    children,
    focusRef,
    ...props
  }: ConfirmButtonProps) => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>()
    const goRef = useRef<HTMLButtonElement>()
    const action = useCallback(() => {
      return promise()
        .then((data) => {
          complete(true, data, null)
          toast({
            title,
            description: successMessage,
            status: 'success',
            duration: 3000,
          })
        })
        .catch((err) => {
          complete(false, null, err)
          toast({
            title,
            description: failureMessage + ' ' + err?.message || err,
            status: 'error',
            duration: 5000,
          })
        })
    }, [complete, failureMessage, promise, successMessage, title, toast])
    return (
      <>
        <Button onClick={onOpen} {...props}>
          {buttonText}
        </Button>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={focusRef || goRef}
          onClose={onClose}
          autoFocus
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {title}
              </AlertDialogHeader>

              <AlertDialogBody>{children}</AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  ref={goRef}
                  colorScheme={confirmColorScheme}
                  onClick={() => {
                    onClose()
                    return action()
                  }}
                  ml={3}
                >
                  {buttonText}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }
)

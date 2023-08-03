import { ApiResult } from "lib/utils";
import { ReactNode, RefObject, useCallback, useRef } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  IconButtonProps,
  useDisclosure,
  useToast
} from "@chakra-ui/react";

export type ConfirmButtonProps<TResponse> = Omit<
  IconButtonProps,
  'aria-label'
> & {
  promise?: () => Promise<ApiResult<TResponse>>
  complete: (
    bool: boolean,
    data: TResponse,
    error?: string
  ) => void | Promise<void>
  alertTitle: string
  buttonText: string
  confirmColorScheme?: string
  successMessage?: string
  failureMessage?: string
  focusRef?: RefObject<
    HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement
  >
  children: ReactNode | ReactNode[]
}

export function ButtonConfirm<TResponse>({
  promise = () =>
    Promise.resolve<ApiResult<TResponse>>(null as ApiResult<TResponse>),
  complete = () => null,
  alertTitle,
  buttonText,
  confirmColorScheme = 'red',
  successMessage,
  failureMessage,
  children,
  focusRef,
  icon,
  title,
  disabled,
  py = 2,
  ...props
}: ConfirmButtonProps<TResponse>) {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>()
  const goRef = useRef<HTMLButtonElement>()
  const action = useCallback(async () => {
    if (disabled) return
    try {
      const { data } = await promise()
      complete(true, data, null)
      if (successMessage)
        toast({
          title: alertTitle,
          description: successMessage,
          status: 'success',
          duration: 3000
        })
    } catch (err) {
      complete(false, null, err)
      if (failureMessage)
        toast({
          title: alertTitle,
          description: failureMessage + ' ' + err?.message || err,
          status: 'error',
          duration: 5000
        })
    }
  }, [
    disabled,
    promise,
    complete,
    successMessage,
    toast,
    alertTitle,
    failureMessage
  ])
  return (
    <>
      {(icon && (
        <IconButton
          onClick={onOpen}
          aria-label={title}
          title={title}
          icon={icon}
          {...props}
        />
      )) || (
        <Button
          onClick={onOpen}
          aria-label={title}
          title={title}
          py={py}
          {...props}
        >
          {buttonText}
        </Button>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={focusRef || goRef}
        onClose={onClose}
        autoFocus
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {alertTitle}
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
                title={title}
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

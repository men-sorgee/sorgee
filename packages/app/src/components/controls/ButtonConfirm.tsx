import { gradient } from "lib/utils";
import { ReactNode, RefObject, useCallback, useRef } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  IconButton,
  IconButtonProps,
  useDisclosure,
  useToast
} from "@chakra-ui/react";

export type ButtonConfirmProps<TResponse = void> = Omit<
  IconButtonProps,
  'aria-label' | 'onError'
> & {
  confirmedAction?: () => Promise<TResponse> | TResponse | void
  onSuccess?: (response: TResponse) => Promise<void> | TResponse | void
  onError?: (error: Error) => Promise<void> | void
  alertTitle: string
  buttonText: string
  confirmColorScheme?: string
  successMessage?: string
  failureMessage?: string
  focusRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>
  children: ReactNode | ReactNode[]
}

export function ButtonConfirm<TResponse = void>({
  confirmedAction = () => Promise.resolve<TResponse>(null),
  onSuccess,
  onError,
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
  color = 'white',
  colorScheme,
  w = ['full', 'auto'],
  ...props
}: ButtonConfirmProps<TResponse>) {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>()
  const goRef = useRef<HTMLButtonElement>()
  const action = useCallback(async () => {
    if (disabled) return
    try {
      const response = await confirmedAction()
      if (onSuccess) await onSuccess(response as any)
      if (successMessage)
        toast({
          title: alertTitle,
          description: successMessage,
          status: 'success',
          duration: 3000,
        })
    } catch (err) {
      if (onError) await onError(err)
      if (failureMessage)
        toast({
          title: alertTitle,
          description: failureMessage,
          status: 'error',
          duration: 5000,
        })
    }
  }, [
    disabled,
    confirmedAction,
    onSuccess,
    successMessage,
    toast,
    alertTitle,
    failureMessage,
    onError,
  ])
  const bgGradient = gradient(colorScheme)
  const bgGradientHover = gradient(colorScheme, 100)
  return (
    <>
      {(icon && (
        <IconButton
          onClick={onOpen}
          aria-label={title}
          title={title}
          icon={icon}
          bgGradient={bgGradient}
          color={color}
          _hover={{
            bgGradient: bgGradientHover,
          }}
          {...props}
        />
      )) || (
          <Button
            onClick={onOpen}
            aria-label={title}
            title={title}
            py={py}
            color={color}
            w={w}
            bgGradient={bgGradient}
            _hover={{
              bgGradient: bgGradientHover,
            }}
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
            <AlertDialogBody>
              {children}
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup gap={2}>
                <Button
                  ref={goRef}
                  onClick={() => {
                    onClose()
                    action()
                  }}
                  ml={3}
                  title={title}
                  bgGradient={gradient(confirmColorScheme)}
                  _hover={{
                    bgGradient: gradient(confirmColorScheme, 100),
                  }}
                >
                  {buttonText}
                </Button>
                <Button
                  ref={cancelRef}
                  bgGradient={gradient('gray')}
                  _hover={{
                    bgGradient: gradient('gray', 100),
                  }}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog >
    </>
  )
}

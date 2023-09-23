import { Loading } from "components";
import { useWarnIfUnsavedChanges } from "hooks/use-warn-if-unsaved";
import { ApiError, debouncedPromise } from "lib/utils";
import { ReactElement, ReactNode, useCallback, useEffect } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  UseFormReturn
} from "react-hook-form";

import { useToast } from "@chakra-ui/react";

export type FormProps<TData = any, TResponse = TData> = {
  successMessage?: string
  defaultValues?: Partial<TData> | Promise<Partial<TResponse>>
  children: (
    context: UseFormReturn<TData>
  ) => ReactElement | ReactNode | ReactNode[]
  autoSave?: boolean
  onSubmit: (data: TData) => Promise<TResponse>
  onSuccess?: (data: TResponse) => void
  onError?: (error: ApiError) => void
}

export default function Form<TData = any, TResponse = TData>({
  successMessage = 'Success',
  defaultValues,
  children,
  onSubmit,
  onSuccess = () => { },
  onError = () => { },
  autoSave = false
}: FormProps<TData, TResponse>) {
  const methods = useForm<TData>({
    defaultValues: defaultValues as any,
    values: defaultValues as any,
    resetOptions: {
      keepDirtyValues: true
    }
  })
  const {
    handleSubmit,
    formState: { isDirty, isValidating, isValid, isSubmitting },
    trigger,
    reset
  } = methods

  useWarnIfUnsavedChanges(isDirty, () => {
    return confirm(
      'Are you sure you want to leave? You have unsaved changes.'
    )
  })

  const toast = useToast()

  const debouncedSubmit = debouncedPromise(onSubmit, 1000)

  const onSubmitWrapper = useCallback(
    async (data: TData) => {
      debouncedSubmit(data)
        .then((result) => {
          if (successMessage) {
            toast({
              title: 'Success',
              description: successMessage,
              status: 'success',
              duration: autoSave ? 1000 : 4000,
              isClosable: true,
              onCloseComplete: () => {
                reset()
                onSuccess(result)
              }
            })
          }
          else {
            reset()
            onSuccess(result)
          }
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: `Something went wrong ${error.message || error}`,
            status: 'error',
            duration: 9000,
            isClosable: true
          })
          onError(error)
        })
    },
    [
      autoSave,
      debouncedSubmit,
      onSuccess,
      onError,
      reset,
      successMessage,
      toast
    ]
  )

  const debouncedTrigger = debouncedPromise(trigger, 1000)

  useEffect(
    // This function is used to check if the form is valid and if the form has been modified. If the form is valid and the form has been modified, then the form will submit.

    () => {
      if (autoSave && isDirty && !isSubmitting) {
        debouncedTrigger().then((valid) => {
          if (valid) {
            handleSubmit(onSubmitWrapper)()
          }
        })
      }
    },
    [
      autoSave,
      debouncedTrigger,
      handleSubmit,
      isDirty,
      isSubmitting,
      isValid,
      isValidating,
      onSubmitWrapper,
      trigger
    ]
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitWrapper)}>
        {isSubmitting ? <Loading /> : children(methods)}
      </form>
    </FormProvider>
  )
}

interface ConnectFormProps<T = any> {
  children: (
    children: UseFormReturn<T>
  ) => ReactElement | ReactNode | ReactNode[]
}
export function ConnectForm<T>({ children }: ConnectFormProps<T>) {
  const methods = useFormContext<T>()

  return children(methods)
}

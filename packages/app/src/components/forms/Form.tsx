import type { ReactElement } from 'react'
import { ReactNode, useCallback, useEffect } from 'react'

import { useWarnIfUnsavedChanges } from 'hooks/use-warn-if-unsaved'
import { ApiError } from 'lib/models'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'

import { useToast } from '@chakra-ui/react'

import { ApiResult, debouncedPromise } from 'lib/utils'

type FormProps<T = any> = {
  successMessage?: string
  defaultValues?: Partial<T> | Promise<Partial<T>>
  children: (
    context: UseFormReturn<T>
  ) => ReactElement | ReactNode | ReactNode[]
  autoSave?: boolean
  onSubmit: (data: T) => Promise<ApiResult<T>>
  onSuccess?: (data: T) => void
}

export default function Form<T = any>({
  successMessage = 'Success',
  defaultValues,
  children,
  onSubmit,
  onSuccess = () => {},
  autoSave = false
}: FormProps<T>) {
  const methods = useForm<T>({
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
    return window.confirm(
      'Are you sure you want to leave? You have unsaved changes.'
    )
  })

  const toast = useToast()

  const debouncedSubmit = debouncedPromise(onSubmit, 1000)

  const onSubmitWrapper = useCallback(
    async (data: T) => {
      const { success, error } = await debouncedSubmit(data)

      if (success) {
        toast({
          title: 'Success',
          description: successMessage,
          status: 'success',
          duration: autoSave ? 1000 : 4000,
          isClosable: true,
          onCloseComplete: () => {
            reset()
            onSuccess(data)
          }
        })
      } else if (error?.field) {
        // @ts-ignore
        setError(error!.field, error.message)
      } else {
        toast({
          title: 'Error',
          description: `Something went wrong ${error.message || error}`,
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      }
    },
    [autoSave, debouncedSubmit, onSuccess, reset, successMessage, toast]
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
      <form onSubmit={handleSubmit(onSubmitWrapper)}>{children(methods)}</form>
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

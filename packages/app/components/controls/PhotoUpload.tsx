import {
  Stack,
  Center,
  Input,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Button,
  Text,
  chakra,
} from '@chakra-ui/react'
import { ErrorMessage } from '@hookform/error-message'
import { useState, ChangeEvent, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useMember } from 'hooks'
import { ApiResponse } from 'lib/models'
import { getAssetUrl } from 'lib/utils'
import { FieldCheckbox, FieldInput, FieldText } from 'components/forms'

type Props = {
  memberId: string
  field: 'picture' | 'public' | 'private'
  setCompleted: (completed: boolean) => void
  file: string
}

type FormValues = { memberId; file: File; name: string; description: string; verify: boolean }

export const PhotoUpload = chakra(({ memberId, file: f, setCompleted, field }: Props) => {
  const [file, setFile] = useState<File>(undefined)
  const [previewUrl, setPreviewUrl] = useState<string>(undefined)
  const methods = useForm<FormValues>({
    defaultValues: {},
    mode: 'onChange',
  })
  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = methods

  useEffect(() => {
    if (f && !previewUrl) {
      setPreviewUrl(f)
    }
  }, [])

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target

    const file = fileInput.files ? (fileInput.files?.length ? fileInput.files[0] : null) : null
    if (!file || !file.type.startsWith('image')) {
      setError('file', { message: 'Please select a valid image' })
      return
    }
    clearErrors()
    setFile(file)
    setPreviewUrl(URL.createObjectURL(file))

    e.currentTarget.type = 'text'
    e.currentTarget.type = 'file'
  }

  const onCancelFile = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!previewUrl && !file) {
      return
    }
    reset({ file: null, verify: false })
    clearErrors()
    setFile(null)
    setPreviewUrl(null)
  }

  async function onSubmit({ verify, name, description }: FormValues) {
    if (!file || !verify) return

    try {
      let formData = new FormData()
      formData.append('media', file)
      formData.append('name', name)
      formData.append('description', description)
      const res = await fetch(`/api/member/${memberId}/photos/${field}`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setCompleted(true)
      } else {
        const body = (await res.json()) as ApiResponse
        if (body.error?.field) {
          setError(body.error!.field as any, body.error.message as any)
        } else {
          setError('file', { message: 'Something went wrong' })
        }
      }
    } catch (error) {
      setError('file', { message: error.message })
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text fontSize="xl"></Text>

        <Stack alignItems="center">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="file uploader preview"
              src={previewUrl}
              width={200}
              height={250}
              style={{ margin: '0 auto' }}
            />
          ) : (
            <Center
              as="label"
              py={3}
              px={100}
              border={'1px dashed'}
              borderColor="primary"
              minH={350}
            >
              <Input hidden onChange={onFileUploadChange} type="file" />
              <Text fontSize="xl" textAlign="center">
                Drop Image Here
              </Text>
            </Center>
          )}

          <VStack alignItems="center" align="center" justify="middle" textAlign="center">
            <FieldInput
              field="name"
              label="Name"
              registerOptions={{ required: 'Name is Required' }}
            />
            <FieldText field="description" label="Description" />
            <FieldCheckbox
              w="fit-content"
              field="verify"
              label="I certify that the photo is of me."
              registerOptions={{ required: 'Certification is Required' }}
            />
            <ErrorMessage
              render={(m) => <Text className="text-red-500">{m.message}</Text>}
              errors={errors}
              name={'file'}
            />
          </VStack>

          <HStack spacing={4} justify="center">
            <Button color="info" size="lg" disabled={!previewUrl} onClick={onCancelFile}>
              Clear
            </Button>
            {file && (
              <Button type="submit" size="lg" disabled={!previewUrl} colorScheme="accent">
                Upload
              </Button>
            )}
          </HStack>
        </Stack>
      </form>
    </FormProvider>
  )
})

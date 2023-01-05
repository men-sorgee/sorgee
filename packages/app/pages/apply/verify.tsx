import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import ApplicationSteps from './_steps'
import { Button, Stack, Text, Heading, VStack, HStack, Input } from '@chakra-ui/react'
import Page from 'components/Page'
import FieldCheckbox from 'components/forms/FieldCheckbox'
import { FormProvider, useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { ApiResponse } from 'lib/models'
import { getAssetUrl } from 'lib/utils'

function Verification() {
  const { member, loading } = useMember()
  const [completed, setCompleted] = useState(false)
  const router = useRouter()

  return (
    <Page
      title="Identification"
      loading={loading || completed}
      requireAuth={true}
      header={<ApplicationSteps status={'verify'} />}
    >
      {member?.id && (
        <Form
          code={`${member.id.slice(0, 4)} ${member.id.slice(4, 8)}`}
          {...{ member, router, setCompleted }}
        />
      )}
    </Page>
  )
}

function Form({ code, router, setCompleted }): JSX.Element {
  const { member, reload } = useMember()
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    member?.photo ? getAssetUrl(member.photo) : null
  )
  const [file, setFile] = useState<File | null>(null)

  const methods = useForm<{ file: File; verify: boolean }>({
    defaultValues: { verify: false },
    mode: 'onChange',
  })
  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = methods

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

  function skip() {
    router.push('/apply/review')
  }

  async function onSubmit({ verify }: { verify: boolean }) {
    if (!file || !verify) return

    try {
      let formData = new FormData()
      formData.append('media', file)

      const res = await fetch('/api/member/verify', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        reload()
        setCompleted(true)
        router.push('/apply/review')
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
        <Text fontSize="xl">
          To verify you are who you say you are, please take a selfie while holding a piece of paper
          with the following verification-code written on it.
        </Text>

        <Stack>
          <Heading as="h2" size="4xl" textAlign="center">
            {code}
          </Heading>
          {previewUrl ? (
            <img
              alt="file uploader preview"
              src={previewUrl}
              width={300}
              height={350}
              style={{ margin: '0 auto' }}
            />
          ) : (
            <label className="flex h-full cursor-pointer flex-col items-center justify-center py-3 transition-colors duration-150 hover:text-gray-600">
              <Input
                className="file-input-bordered file-input-primary file-input w-full max-w-xs"
                onChange={onFileUploadChange}
                type="file"
              />
            </label>
          )}
          {member?.photo_denial_reason && (
            <Text className="text-lg text-red-500">
              Your verification photo was denied.
              {member.photo_denial_reason}
            </Text>
          )}
          <Text fontSize="xl" textAlign="center">
            <strong>
              Be sure your face and code is clearly visible, with no sunglasses or hats.
            </strong>
            <br />
            This photo will not be shared with anyone and will not be used for your profile.
          </Text>
          <VStack alignItems="center" justify="middle" textAlign="center">
            <FieldCheckbox
              field="verify"
              label="I certify that the photo I am submitting is me."
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
            {member?.photo && !member?.photo_denial_reason && (
              <Button type="submit" size="lg" onClick={handleSubmit(skip)} color="primary.500">
                Use Existing
              </Button>
            )}
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
}

export default Verification

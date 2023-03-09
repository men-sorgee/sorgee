import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import ApplicationSteps from './_steps'
import {
  Button,
  Center,
  Stack,
  Text,
  Alert,
  Flex,
  HStack,
  Input,
  Heading,
  Image,
  AlertIcon,
} from '@chakra-ui/react'
import Page from 'components/Page'
import FieldCheckbox from 'components/forms/FieldCheckbox'
import { FormProvider, useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { ApiResponse } from 'lib/models'
import { getAssetUrl } from 'lib/utils'

function Verification() {
  const { member, loading } = useUser()
  const [completed, setCompleted] = useState(false)
  const router = useRouter()

  return (
    <Page
      title="Identification"
      loading={loading || completed}
      requireAuth={true}
      header={<ApplicationSteps status={'verify'} />}
    >
      {member?.id && !completed && (
        <Form
          code={`${member.id.slice(0, 4)} ${member.id.slice(4, 8)}`}
          {...{ member, router, setCompleted }}
        />
      )}
    </Page>
  )
}

function Form({ code, router, setCompleted }): JSX.Element {
  const { member, reload } = useUser()
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
    watch,
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
    reload().then(() => {
      window.location.href = '/apply/review'
    })
  }

  async function onSubmit({ verify }: { verify: boolean }) {
    if (!file || !verify) return

    try {
      let formData = new FormData()
      formData.append('media', file)
      const res = await fetch('/api/apply/verify', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
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
  const isVerified = watch('verify', false)
  const hasPhoto = previewUrl != null || file != null

  const canUpload = isVerified && hasPhoto

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" alignItems="center"></Flex>
        <Stack alignItems="center" spacing={4}>
          <Text fontSize="xl">
            To verify you are who you say you are, please take a selfie while holding a piece of
            paper with the following verification-code written on it. ( This photo will not be
            shared with anyone and will not be used for your profile.)
          </Text>
          <Heading size="3xl" mb={3}>
            {code}
          </Heading>
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              objectFit="cover"
              border="1px solid"
              rounded="md"
              shadow="md"
              borderColor="gray.200"
              alt="file uploader preview"
              src={previewUrl}
              width={300}
              height={350}
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
          {member?.photo_denial_reason && (
            <Alert status="error" bg="red.200" size="lg" maxW="lg" mx="auto">
              <AlertIcon />
              <Text>
                Your verification photo was denied.
                <br />
                {member.photo_denial_reason}
              </Text>
            </Alert>
          )}
          <Alert rounded="lg" shadow="lg" status="warning">
            <AlertIcon />
            <Text fontSize="xl" textAlign="left">
              <strong>
                Be sure your face and code is clearly visible, with no sunglasses or hats.
              </strong>
              <br />
              Your photo will not be accepted without the verification code written on a piece of
              paper.
            </Text>
          </Alert>
          <Flex alignItems="center" align="center" justify="middle" textAlign="center">
            <FieldCheckbox
              w="fit-content"
              field="verify"
              label=""
              registerOptions={{ required: 'Certification is Required' }}
            >
              I certify that the photo I am submitting is me.
            </FieldCheckbox>
            <ErrorMessage
              render={(m) => <Text className="text-red-500">{m.message}</Text>}
              errors={errors}
              name={'file'}
            />
          </Flex>

          <HStack spacing={4} justify="center">
            <Button size="lg" disabled={!previewUrl} onClick={onCancelFile}>
              Clear
            </Button>
            {member?.photo && !member?.photo_denial_reason && isVerified && (
              <Button type="submit" size="lg" onClick={handleSubmit(skip)} colorScheme="primary">
                Use Existing
              </Button>
            )}
            {file && (
              <Button type="submit" size="lg" disabled={!canUpload} colorScheme="accent">
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

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState
} from 'react'

import { PhotoCapture } from 'components/controls'
import { FieldCheckbox } from 'components/forms'
import Page from 'components/Page'
import { useUser } from 'hooks/use-user'
import {
  ApiResponse,
  ApplicationStatus,
  Member,
  MemberLevel
} from '@lib/models'
import { getAssetUrl } from '@lib/utils'
import { NextRouter, useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Stack,
  Text
} from '@chakra-ui/react'
import { ArrowUpTrayIcon, CameraIcon } from '@heroicons/react/24/outline'
import { ErrorMessage } from '@hookform/error-message'

import ApplicationSteps from './_steps'

function Verification() {
  const { member, loading, reload } = useUser({
    minLevel: MemberLevel.applicant,
    minAppStatus: ApplicationStatus.verify
  })
  const [complete, setComplete] = useState(false)
  const router = useRouter()

  return (
    <Page
      title="Identification"
      loading={loading || complete}
      requireAuth={true}
      header={<ApplicationSteps status={'verify'} />}
    >
      {member?.id && !complete && (
        <Form
          code={`${member.id.slice(0, 4)} ${member.id.slice(4, 8)}`}
          {...{ member, router, reload, setComplete }}
        />
      )}
    </Page>
  )
}

function Form({
  code,
  router,
  setComplete,
  member,
  reload
}: {
  member: Member
  reload: () => Promise<Member>
  router: NextRouter
  code: string
  setComplete: Dispatch<SetStateAction<boolean>>
}): JSX.Element {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    member?.photo ? getAssetUrl(member.photo) : null
  )
  const [file, setFile] = useState<File | null>(null)
  const [camera, setCamera] = useState<boolean>()

  const methods = useForm<{ file: File; verify: boolean }>({
    defaultValues: { verify: false },
    mode: 'onChange'
  })
  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors }
  } = methods

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target

    const file = fileInput.files
      ? fileInput.files?.length
        ? fileInput.files[0]
        : null
      : null
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
      router.push('/apply/review')
    })
  }

  const acceptPhoto = useCallback(
    (data: string) => {
      fetch(data)
        .then((res) => res.blob())
        .then((blob) => {
          let file = new File([blob], 'verification-photo.jpg', {
            type: 'image/jpeg'
          })
          setFile(file)
          setPreviewUrl(data)
          setCamera(false)
        })
    },
    [setFile]
  )

  const takePhoto = useCallback(() => {
    setCamera(true)
  }, [])

  async function onSubmit({ verify }: { verify: boolean }) {
    if (!file || !verify) return

    try {
      let formData = new FormData()
      formData.append('media', file, 'verification-photo.jpg')

      const res = await fetch('/api/apply/verify', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        setComplete(true)
        reload().then(() => {
          router.push('/apply/review')
        })
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
  const fileInput = useRef<HTMLInputElement>(null)
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" alignItems="center"></Flex>
        <Stack alignItems="center" spacing={4}>
          <Text fontSize="xl">
            To verify you are who you say you are, please take a selfie while
            holding a piece of paper with the following verification-code
            written on it. ( This photo will not be shared with anyone and will
            not be used for your profile.)
          </Text>
          <Heading size="3xl" mb={3}>
            {code}
          </Heading>

          {camera && (
            <Box w={['full', '75%']}>
              <PhotoCapture onAccept={acceptPhoto} />
            </Box>
          )}

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
              w={['full', '75%']}
              style={{ margin: '0 auto' }}
            />
          ) : (
            !camera && (
              <Center
                as="label"
                py={3}
                px={100}
                border={'1px dashed'}
                borderColor="primary"
                w={['full', '75%']}
                minH={350}
              >
                <Input
                  hidden
                  onChange={onFileUploadChange}
                  type="file"
                  ref={fileInput}
                />
                <IconButton
                  aria-label="Take Photo"
                  icon={<CameraIcon />}
                  size="lg"
                  variant="ghost"
                  onClick={takePhoto}
                  color="white"
                  rounded="full"
                  bg="primary.500"
                  opacity=".15"
                  _hover={{ opacity: 1, bg: 'primary.500' }}
                  p={2}
                />
                <IconButton
                  onClick={() => {
                    fileInput.current?.click()
                  }}
                  icon={<ArrowUpTrayIcon />}
                  aria-label="Upload Photo"
                  bg="primary.500"
                  opacity=".15"
                  size="lg"
                  variant="ghost"
                  color="white"
                  rounded="full"
                  _hover={{ opacity: 1, bg: 'primary.500' }}
                  p={2}
                ></IconButton>
              </Center>
            )
          )}
          {member?.photo_denial_reason && (
            <Alert
              status="error"
              bg="red.200"
              size="lg"
              w={['full', '75%']}
              mx="auto"
            >
              <AlertIcon />
              <Text>
                Your verification photo was denied.
                <br />
                {member.photo_denial_reason}
              </Text>
            </Alert>
          )}
          <Alert rounded="lg" shadow="lg" status="warning" w={['full', '75%']}>
            <AlertIcon />
            <Text fontSize="xl" textAlign="left">
              <strong>
                Be sure your face and code is clearly visible, with no
                sunglasses or hats.
              </strong>
              <br />
              Your photo will not be accepted without the verification code
              written on a piece of paper.
            </Text>
          </Alert>
          <Flex
            alignItems="center"
            align="center"
            justify="middle"
            textAlign="center"
          >
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
              <Button
                type="submit"
                size="lg"
                onClick={handleSubmit(skip)}
                colorScheme="primary"
              >
                Use Existing
              </Button>
            )}
            {file && (
              <Button
                type="submit"
                size="lg"
                disabled={!canUpload}
                colorScheme="accent"
              >
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

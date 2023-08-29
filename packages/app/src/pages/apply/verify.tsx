import { ButtonBusy, Page, PhotoCapture } from "components";
import { useUser } from "hooks/use-user";
import { ApplicationStatus, Member, MemberLevel } from "lib/models";
import { getAssetUrl, postForm, postJSON } from "lib/utils";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Stack,
  Text
} from "@chakra-ui/react";
import { ArrowUpTrayIcon, CameraIcon } from "@heroicons/react/24/outline";

import ApplicationSteps from "./_steps";

function VerificationPage() {
  const { member, loading, reload } = useUser({
    minLevel: MemberLevel.applicant,
    minAppStatus: ApplicationStatus.verify,
    redirectsEnabled: true,
  })
  const [complete, setComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (complete) {
      router.push('/apply/review').catch(console.error)
    } else if (
      !loading &&
      ApplicationStatus[member.application_status] !== ApplicationStatus.verify
    ) {
      router.push('/apply/' + member.application_status).catch(console.error)
    }
  }, [complete, router, loading, member?.application_status])

  return (
    <Page
      title="Verification"
      loading={loading || complete}
      header={<ApplicationSteps status={'verify'} />}
    >
      {member?.id && !complete && (
        <VerifyForm
          member={member}
          reload={reload}
          code={`${member.id.slice(0, 4)} ${member.id.slice(4, 8)}`}
          setComplete={setComplete}
          complete={complete}
        />
      )}
    </Page>
  )
}

function VerifyForm({
  code,
  setComplete,
  complete,
  member,
  reload,
}: {
  code: string
  complete: boolean
  setComplete: Dispatch<SetStateAction<boolean>>
  member: Member
  reload: () => Promise<Member>
}): JSX.Element {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    member?.photo ? getAssetUrl(member.photo) : null
  )
  const [file, setFile] = useState<File | null>(null)
  const [camera, setCamera] = useState<boolean>()
  const [isVerified, setVerify] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target

    const file = fileInput.files ? (fileInput.files?.length ? fileInput.files[0] : null) : null

    if (!file || !file.type.startsWith('image')) {
      setError('Please select a valid image')
      return
    }
    setError(null)
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
    setError(null)
    setFile(null)
    setPreviewUrl(null)
  }

  const acceptPhoto = useCallback(
    (data: string) => {
      fetch(data)
        .then((res) => res.blob())
        .then((blob) => {
          let file = new File([blob], 'verification-photo.jpg', {
            type: 'image/jpeg',
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

  const submitExisting = useCallback(async () => {
    if (!isVerified) {
      setError('Please check the box to verify')
    }
    const { success } = await postJSON('/api/apply/verify', null)
    if (success) {
      reload().then(() => {
        setComplete(true)
      })
    }
  }, [setComplete, isVerified, reload])

  const submitNew = useCallback(async () => {
    if (!isVerified) {
      setError('Please check the box to verify')
    }

    const { success, error } = await postForm('/api/apply/verify', (data) => {
      data.append('media', file, 'verification-photo.jpg')
    })

    if (success) {
      reload().then(() => setComplete(true))
    } else {
      if (error) {
        setError(error.message)
      } else {
        setError('Something went wrong')
      }
    }
  }, [file, isVerified, reload, setComplete])

  const hasPhoto = member?.photo !== null
  const hasUpload = file !== null && previewUrl !== null

  const fileInput = useRef<HTMLInputElement>(null)
  const verifyCheckbox = useRef<HTMLInputElement>(null)
  return (
    <>
      <Flex direction="column" alignItems="center"></Flex>
      <Stack alignItems="center" spacing={4}>
        <Text fontSize="xl">
          To verify you are who you say you are, please take a selfie while holding a piece of paper
          with the following verification-code written on it. ( This photo will not be shared with
          anyone and will not be used for your profile.)
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
              <Input hidden onChange={onFileUploadChange} type="file" ref={fileInput} />
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
          <Alert status="error" alignItems="start" size="lg" w={['full', '75%']} mx="auto">
            <AlertIcon />
            <Text mt={0}>
              Your verification photo was denied: &nbsp; &apos;
              {member.photo_denial_reason}&apos;
            </Text>
          </Alert>
        )}
        <Alert rounded="lg" shadow="lg" alignItems="start" w={['full', '75%']}>
          <AlertIcon />
          <Text fontSize="xl" textAlign="left" mt={0}>
            <strong>
              Be sure your face and code is clearly visible, with no sunglasses or hats.
            </strong>
            <br />
            Your photo will not be accepted without the verification code written on a piece of
            paper.
          </Text>
        </Alert>
        {((hasPhoto && member?.photo_denial_reason === null) || hasUpload) && (
          <Flex dir="column" alignItems="center" align="center" justify="middle" textAlign="center">
            <Checkbox
              ref={verifyCheckbox}
              name="verify"
              onChange={(e) => {
                e.target.checked ? setVerify(true) : setVerify(false)
              }}
            >
              I certify that the photo I am submitting is me.
            </Checkbox>
            {error && <Text className="text-red-500">{error}</Text>}
          </Flex>
        )}

        {!complete && (
          <>
            <HStack spacing={4} justify="center">
              {(hasPhoto || hasUpload) && previewUrl && (
                <Button size="lg" disabled={!previewUrl} onClick={onCancelFile}>
                  Clear
                </Button>
              )}
              {hasPhoto && member?.photo_denial_reason === null && (
                <ButtonBusy
                  size="lg"
                  disabled={!isVerified}
                  onClick={() => submitExisting()}
                  colorScheme="primary"
                >
                  Use Existing
                </ButtonBusy>
              )}
              {hasUpload && (
                <ButtonBusy
                  size="lg"
                  disabled={!isVerified}
                  colorScheme="accent"
                  onClick={() => submitNew()}
                >
                  Upload & Continue
                </ButtonBusy>
              )}
            </HStack>
            {error && <Alert rounded="lg" shadow="lg" status="warning" alignItems="start" w={['full', '75%']}>
              <AlertIcon />
              <Text fontSize="xl" textAlign="left" mt={0}>
                <strong>If you are having troubles uploading a photo, it may be due to
                  an ad-blocker. Please disable your ad-blocker and try again.
                </strong> If you need to email your photo, please do so to <a href="mailto:system@guysnheat.com">system@guysnheat.com</a>
              </Text>
            </Alert>}
          </>
        )}
      </Stack>
    </>
  )
}

export default VerificationPage

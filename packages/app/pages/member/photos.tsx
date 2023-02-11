import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import { useState, ChangeEvent, useCallback } from 'react'
import { TakePhoto } from 'components/ui'
import {
  Button,
  Center,
  Stack,
  Text,
  Heading,
  VStack,
  HStack,
  Input,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Wrap,
  Box,
  Container,
  Square,
  Link,
} from '@chakra-ui/react'
import Page from 'components/Page'
import FieldCheckbox from 'components/forms/FieldCheckbox'
import { FormProvider, useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { ApiResponse, UserFile, Member } from 'lib/models'
import { getAssetUrl } from 'lib/utils'
import invite from './invite'

function PhotoAlbums() {
  const [camera, setCamera] = useState(false)
  const [picture, setPicture] = useState<string | undefined>()
  const [image, setImage] = useState<string | undefined>()
  //user?.picture ? '/api/asset/' + user?.picture : undefined

  const [working, setWorking] = useState(false)
  const { member, loading } = useMember()
  const [completed, setCompleted] = useState(false)
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const takePhoto = useCallback(
    (data: string) => {
      setPicture(data)
      setImage(data)
      setCamera(false)
    },
    [setImage, setPicture, setCamera]
  )
  const updateInvite = useCallback(
    async (data: FormValues) => {
      setWorking(true)
      if (picture) {
        const media = await fetch(picture!).then((res) => res.blob())
        let formData = new FormData()
        formData.append('media', media)
        await fetch(`/api/member/${member.id}/image/picture?name=${member.email}-face`, {
          method: 'POST',
          body: formData,
        })
      }
    },
    [event?.id, invite?.id, picture, router, setError, toast, user?.email, user?.id]
  )
  return (
    <Page title="Your Photos" loading={loading || completed} requireAuth={true}>
      {member?.id && (
        <>
          <Tabs size="lg" align="center" variant="line" w="full">
            <TabList>
              <Tab>Public Photos</Tab>
              <Tab>Private Photos</Tab>
              <Tab>Manage Shares</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Heading mb={10}>Public Photos</Heading>
                <Wrap>
                  {member.my_photos?.map((image: UserFile) => (
                    <Box
                      key={image.directus_files_id}
                      w="200px"
                      h="200px"
                      p={2}
                      bg="black"
                      overflow="clip"
                      padding={4}
                      rounded="lg"
                    >
                      <Link href={`/member/photos/${image.directus_files_id}`} target="_blank">
                        <Image
                          key={image.directus_files_id}
                          src={`/api/asset/${image.directus_files_id}`}
                          alt={image.description}
                          height={image.height}
                          width={image.width}
                        />
                      </Link>
                    </Box>
                  ))}
                </Wrap>
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
              <TabPanel>
                <p>three!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Button size="lg" colorScheme="primary" onClick={onOpen}>
            Upload Photo
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Tabs size="lg" align="center" variant="line" w="full">
                  <TabList>
                    <Tab>Upload Photo</Tab>
                    <Tab>Take a Photos</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Form
                        code={`${member.id.slice(0, 4)} ${member.id.slice(4, 8)}`}
                        {...{ member, router, setCompleted }}
                      />
                    </TabPanel>
                    <TabPanel>
                      <TakePhoto onAccept={onAccept} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </ModalBody>

              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
        </>
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

  async function onSubmit({ verify }: { verify: boolean }) {
    if (!file || !verify) return

    try {
      let formData = new FormData()
      formData.append('media', file)
      formData.append('image_field', 'photo')
      formData.append('image_name', '')
      const res = await fetch(`/api/member/${member.id}/photos`, {
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
          {member?.photo_denial_reason && (
            <Alert status="error" bg="red.200" size="lg" maxW="lg" mx="auto">
              <AlertIcon />
              <Text>
                Your photo was denied.
                <br />
                {member.photo_denial_reason}
              </Text>
            </Alert>
          )}

          <VStack alignItems="center" align="center" justify="middle" textAlign="center">
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
}

export default PhotoAlbums

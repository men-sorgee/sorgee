import { useCallback, useEffect, useState } from 'react'

import {
  ButtonConfirm,
  ImageAsset,
  MemberAvatar,
  PhotoCapture,
  PhotoUpload
} from 'components/controls'
import Page from 'components/Page'
import { UserPhoto } from 'lib/models'
import { deleteJSON, getAssetUrl } from 'lib/utils'

import { useUser } from 'hooks/use-user'
import {
  Alert,
  AlertIcon,
  Box,
  chakra,
  Flex,
  HStack,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  StackProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  Wrap
} from '@chakra-ui/react'
import { ArrowUpTrayIcon, CameraIcon } from '@heroicons/react/24/outline'

type Props = {}

type PhotoItem = {
  fileId: string
  photoId: number
  is_public: boolean
}
export default function PhotoAlbums({}: Props) {
  const { member, loading, reload } = useUser()
  const [pictureSrc, setPictureSrc] = useState<string>(undefined)

  useEffect(() => {
    if (!loading && member) {
      if (member?.picture && pictureSrc == undefined) {
        setPictureSrc(getAssetUrl(member?.picture))
      }
    }
  }, [loading, member, pictureSrc, reload])

  const list =
    member?.my_photos?.map((image: UserPhoto) => {
      return {
        fileId: image.directus_files_id as string,
        photoId: image.id as number,
        is_public: image.is_public
      }
    }) || []
  const publicImages = list.filter((image: PhotoItem) => image.is_public)
  const privateImages = list.filter((image: PhotoItem) => !image.is_public)

  return (
    <Page title="Your Photos" loading={loading} requireAuth={true}>
      {member && (
        <>
          <Flex align="center" justify="center">
            {(pictureSrc && (
              <Flex direction="column" mb={4}>
                <MemberAvatar
                  member={member}
                  width="150px"
                  height="150px"
                  rounded="full"
                />
                <ButtonConfirm
                  title="Delete Avatar"
                  buttonText="Delete"
                  promise={async () => {
                    const { success, data, error } = await deleteJSON(
                      `/api/member/${member?.id}/photos/picture`
                    )
                    if (!success) throw new Error(error.message)
                    return data
                  }}
                  complete={() => {
                    setPictureSrc(null)
                    reload()
                  }}
                  size="sm"
                  maxW="fit-content"
                  margin="auto"
                  successMessage="Avatar deleted"
                  failureMessage="Avatar not deleted"
                  mt={'-3rem'}
                  variant="ghost"
                  bg="white"
                  opacity=".15"
                  color="black"
                  _hover={{ opacity: 1, bg: 'white' }}
                >
                  Are you sure you want to delete this photo?
                </ButtonConfirm>
              </Flex>
            )) || (
              <AddPhoto
                name={`Avatar for ${member?.id}`}
                title={'Avatar Picture'}
                field={'picture'}
                memberId={member?.id}
                reload={reload}
                rounded="full"
              />
            )}
          </Flex>

          {(member.show_photos && (
            <Tabs size="lg" align="center" variant="line" w="full" mb={10}>
              <TabList>
                <Tab>Public Album</Tab>
                <Tab>Private Album</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <PhotoList
                    title="Public Album"
                    images={publicImages}
                    field="public"
                    memberId={member.id}
                    reload={reload}
                  />
                </TabPanel>
                <TabPanel>
                  <PhotoList
                    title="Private Album"
                    images={privateImages}
                    field="private"
                    memberId={member.id}
                    reload={reload}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          )) || (
            <Alert mt={4} status="warning" rounded="lg" shadow="lg">
              <AlertIcon />
              You have photo-sharing turned off. Update&nbsp;
              <Link href="/member/profile">your profile</Link>&nbsp; to change
              that.
            </Alert>
          )}
        </>
      )}
    </Page>
  )
}

type PhotoListProps = PhotoProps & {
  images: PhotoItem[]
}
function PhotoList({ title, field, images, memberId, reload }: PhotoListProps) {
  return (
    <Wrap spacing={4}>
      {images?.map((image: PhotoItem) => (
        <Box key={image.fileId}>
          <Link href={`/api/asset/${image.fileId}`} target="_blank">
            <ImageAsset fileId={image.fileId} rounded="md" shadow="md" />
          </Link>
          <ButtonConfirm
            title="Delete Photo"
            buttonText="Delete"
            promise={async () => {
              const { success, data, error } = await deleteJSON(
                `/api/member/photo/${image.photoId}`
              )
              if (!success) throw new Error(error.message)
              return data
            }}
            complete={(success) => {
              if (success) {
                reload()
              }
            }}
            successMessage="Photo deleted"
            failureMessage="Photo not deleted"
            mt={'-6rem'}
            variant="ghost"
            bg="white"
            opacity=".15"
            color="black"
            _hover={{ opacity: 1, bg: 'white' }}
          >
            Are you sure you want to delete this photo?
          </ButtonConfirm>
        </Box>
      ))}

      <AddPhoto
        title={title}
        field={field}
        memberId={memberId}
        reload={reload}
      />
    </Wrap>
  )
}

type PhotoProps = StackProps & {
  title: string
  field: 'picture' | 'private' | 'public'
  memberId: string
  reload: () => void
}
const AddPhoto = chakra(
  ({
    title,
    memberId,
    field,
    reload,
    rounded = 'lg',
    ...props
  }: PhotoProps) => {
    const [image, setImage] = useState<string>()
    const [file, setFile] = useState<File>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [camera, setCamera] = useState<boolean>()

    const acceptPhoto = useCallback(
      (data: string) => {
        setImage(null)
        fetch(data)
          .then((res) => res.blob())
          .then((blob) => {
            let file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
            setFile(file)
            setImage(data)
            setCamera(false)
          })
      },
      [setFile]
    )

    const takePhoto = useCallback(() => {
      setCamera(true)
      onOpen()
    }, [onOpen])

    const uploadPhoto = useCallback(() => {
      setCamera(false)
      onOpen()
    }, [onOpen])

    const setCompleted = useCallback(() => {
      onClose()
      setImage(undefined)
      setFile(undefined)
      reload()
    }, [onClose, reload])

    return (
      <>
        <HStack
          p={2}
          align="center"
          justify="center"
          border="2px dashed"
          borderColor="primary"
          overflow="clip"
          padding={4}
          rounded={rounded}
          h={150}
          w={150}
          {...props}
        >
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
            aria-label="Upload Photo"
            icon={<ArrowUpTrayIcon />}
            variant="ghost"
            onClick={uploadPhoto}
            color="white"
            rounded="full"
            size="lg"
            bg="primary.500"
            opacity=".15"
            _hover={{ opacity: 1, bg: 'primary.500' }}
            p={2}
          />
        </HStack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add {title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody as={Flex} direction="column">
              {(camera && <PhotoCapture onAccept={acceptPhoto} />) || (
                <PhotoUpload
                  file={file}
                  name={`${memberId} ${field}-photo`}
                  description={`Uploaded on ${new Date().toLocaleDateString()}`}
                  postUrl={`/api/member/${memberId}/photos/${field}`}
                  onClear={() => {
                    setImage(undefined)
                    onClose()
                  }}
                  photoUrl={image}
                  setCompleted={setCompleted}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  }
)

import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { TakePhoto, AssetImage, PhotoCapture, PhotoUpload } from 'components/controls'
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
  IconButton,
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
import { PlusIcon } from '@heroicons/react/outline'
import { Member, UserPhoto } from 'lib/models'

type Props = {}

export default function PhotoAlbums({}: Props) {
  const [privateImages, setPrivateImages] = useState<string[]>(undefined)
  const [publicImages, setPublicImages] = useState<string[]>(undefined)
  const { member, loading } = useMember()
  useEffect(() => {
    if (!loading && privateImages == undefined && publicImages == undefined && member?.id) {
      setPublicImages(
        member.my_photos
          .filter((image: UserPhoto) => image.is_public)
          .map((image: UserPhoto) => image.directus_files_id as string)
      )
      setPrivateImages(
        member.my_photos
          .filter((image: UserPhoto) => !image.is_public)
          .map((image: UserPhoto) => image.directus_files_id as string)
      )
    }
  }, [loading, member, privateImages, publicImages])
  return (
    <Page title="Your Photos" loading={loading} requireAuth={true}>
      {member && (
        <>
          <Tabs size="lg" align="center" variant="line" w="full" mb={10}>
            <TabList>
              <Tab>Public Photos</Tab>
              <Tab>Private Photos</Tab>
              <Tab>Manage Shares</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <PhotoList
                  title="Public Photos"
                  images={publicImages}
                  field="public"
                  memberId={member.id}
                />
              </TabPanel>
              <TabPanel>
                <PhotoList
                  title="Private Photos"
                  images={privateImages}
                  field="private"
                  memberId={member.id}
                />
              </TabPanel>
              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </Page>
  )
}

type PhotoProps = {
  title: string
  field: 'picture' | 'private' | 'public'
  memberId: string
}
function AddPhoto({ title, memberId, field }: PhotoProps) {
  const [image, setImage] = useState<string>()
  const [tabIndex, setTabIndex] = useState<number>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const takePhoto = useCallback(
    (data: string) => {
      setImage(data)
      setTabIndex(0)
    },
    [tabIndex, image]
  )

  const setCompleted = useCallback(() => {}, [])
  return (
    <>
      <VStack
        p={2}
        direction="column"
        align="center"
        justify="center"
        border="2px dashed black"
        overflow="clip"
        padding={4}
        rounded="lg"
        h={150}
        w={150}
      >
        <IconButton
          aria-label="Add Photo"
          icon={<PlusIcon />}
          size="lg"
          colorScheme="primary"
          onClick={onOpen}
        />
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add {title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs size="lg" align="center" variant="line" w="full" tabIndex={tabIndex}>
              <TabList>
                <Tab>Upload Photo</Tab>
                <Tab>Camera</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <PhotoUpload
                    field={field}
                    onClear={() => setImage(undefined)}
                    previewUrl={image}
                    setCompleted={setCompleted}
                    memberId={memberId}
                  />
                </TabPanel>
                <TabPanel>
                  <PhotoCapture onAccept={takePhoto} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

type PhotoListProps = PhotoProps & {
  images: string[]
}
function PhotoList({ title, field, images, memberId }: PhotoListProps) {
  return (
    <>
      <Heading mb={10}>{title}</Heading>
      <Wrap>
        {images?.map((image) => (
          <Link key={image} href={`/member/${memberId}/photos/${image}`} target="_blank">
            <AssetImage fileId={image} />
          </Link>
        ))}

        <AddPhoto title={title} field={field} memberId={memberId} />
      </Wrap>
    </>
  )
}

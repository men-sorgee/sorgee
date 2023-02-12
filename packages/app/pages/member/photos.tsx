import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import { useState, ChangeEvent, useCallback } from 'react'
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

import { ApiResponse, DirectusFile, UserPhoto } from 'lib/models'
import { getAssetUrl } from 'lib/utils'
import invite from './invite'
type Props = {}

export default function PhotoAlbums({}: Props) {
  const [camera, setCamera] = useState(false)
  const [picture, setPicture] = useState<string>()
  const [image, setImage] = useState<string>()
  const [field, setField] = useState<'picture' | 'private' | 'public'>('public')
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
  const setUpload = useCallback(async (image: string) => {
    if (image) {
      setPicture(image)
    }
  }, [])
  const publicImages = member?.my_photos
    ?.filter((image: UserPhoto) => image.is_public)
    ?.map((image: UserPhoto) => image.directus_files_id as DirectusFile)
  const privateImages = member?.my_photos
    ?.filter((image: UserPhoto) => !image.is_public)
    ?.map((image: UserPhoto) => image.directus_files_id as DirectusFile)

  return (
    <Page title="Your Photos" loading={loading || completed} requireAuth={true}>
      {member?.id && (
        <>
          <Tabs size="lg" align="center" variant="line" w="full" mb={10}>
            <TabList>
              <Tab>Public Photos</Tab>
              <Tab>Private Photos</Tab>
              <Tab>Manage Shares</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Heading mb={10}>Public Photos</Heading>
                <Wrap>
                  {publicImages?.map((image) => (
                    <Box
                      key={image.id}
                      p={2}
                      bg="black"
                      overflow="clip"
                      padding={4}
                      rounded="lg"
                      h={200}
                      w={200}
                    >
                      <Link href={`/member/photos/${image.id}`} target="_blank">
                        <AssetImage file={image} />
                      </Link>
                    </Box>
                  ))}
                  <VStack
                    p={2}
                    direction="column"
                    align="center"
                    justify="center"
                    border="2px dashed black"
                    overflow="clip"
                    padding={4}
                    rounded="lg"
                    h={200}
                    w={200}
                  >
                    <IconButton
                      aria-label="Add Photo"
                      icon={<PlusIcon />}
                      size="lg"
                      colorScheme="primary"
                      onClick={onOpen}
                    />
                  </VStack>
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

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Tabs size="lg" align="center" variant="line" w="full" tabIndex={0}>
                  <TabList>
                    <Tab>Upload Photo</Tab>
                    <Tab>Take a Photos</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <PhotoUpload
                        field={field}
                        file={image}
                        setCompleted={setCompleted}
                        memberId={member.id}
                      />
                    </TabPanel>
                    <TabPanel>
                      <PhotoCapture onAccept={setUpload} />
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

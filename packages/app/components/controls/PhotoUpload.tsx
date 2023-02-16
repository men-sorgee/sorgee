import {
  Box,
  Flex,
  IconButton,
  Input,
  Image,
  ImageProps,
  HStack,
  Button,
  Icon,
  chakra,
  useToast,
} from '@chakra-ui/react'
import { UploadIcon, XIcon } from '@heroicons/react/outline'
import { useState, ChangeEvent, useEffect, useRef } from 'react'
import { ApiResponse } from 'lib/models'

export type PhotoUploadProps = ImageProps & {
  name: string
  description: string
  photoUrl?: string
  postUrl: string
  file?: File
  imageExtensions?: string[]
  setCompleted?: (completed: boolean) => void
  onClear?: () => void
}

export const PhotoUpload = chakra(
  ({
    name,
    description,
    postUrl,
    photoUrl,
    setCompleted = (b: boolean) => {},
    onClear = () => {},
    imageExtensions = ['.jpg', '.gif', '.png', '.gif'],
    h,
    w,
    file: f,
    ...props
  }: PhotoUploadProps) => {
    const [upload, setUpload] = useState<boolean>(true)
    const [file, setFile] = useState<File>(f)
    const [previewSrc, setPreviewSrc] = useState<string>(undefined)
    const toast = useToast()
    const fileInput = useRef<HTMLInputElement>(null)
    const [photoSrc, setPhotoSrc] = useState<string>(undefined)

    useEffect(() => {
      if (photoUrl && photoSrc == undefined) {
        setPhotoSrc(photoUrl)
        setUpload(false)
      }
    }, [photoSrc, photoUrl])

    const setError = (error: string) => {
      toast({
        title: 'Something went wrong',
        description: error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }

    const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = fileInput?.current?.files
        ? fileInput.current.files?.length
          ? fileInput.current.files[0]
          : null
        : null
      if (!file || !file.type.startsWith('image')) {
        setError('Please select a valid image')
        return
      }
      setFile(file)
      setPreviewSrc(URL.createObjectURL(file))
      setUpload(false)

      e.currentTarget.type = 'text'
      e.currentTarget.type = 'file'
    }

    const onCancelFile = (e: { preventDefault: () => void }) => {
      e.preventDefault()
      onClear()
      setFile(null)
      setPreviewSrc(null)
    }

    async function onSubmit() {
      if (!file) return

      try {
        let formData = new FormData()
        formData.append('media', file)
        const query = `?name=${name}&title=${name}&description=${description}`
        const res = await fetch(postUrl + query, {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          setCompleted(true)
          setFile(null)
        } else {
          const body = (await res.json()) as ApiResponse
          if (body.error?.field) {
            setError(body.error.message as any)
          } else {
            setError('Unknown error')
          }
        }
      } catch (error) {
        setError(error.message)
      }
    }

    const imageSrc = previewSrc || photoSrc

    return (
      <>
        {upload && (
          <Flex
            h={h || w}
            w={w || h}
            cursor="pointer"
            border="3px dotted"
            borderColor="primary.500"
            mx="auto"
            p={8}
          >
            <label>
              <Input
                accept={imageExtensions.join(',')}
                hidden
                onChange={onFileUploadChange}
                type="file"
                ref={fileInput}
              />
              <Icon
                cursor="pointer"
                color="white"
                rounded="full"
                bg="primary"
                h="3em"
                w="3em"
                p={3}
                as={UploadIcon}
                margin="auto"
              />
            </label>
            <Icon
              color="white"
              rounded="full"
              bg="primary"
              h="3em"
              w="3em"
              as={XIcon}
              p={3}
              ml="2rem"
              margin="auto"
              onClick={() => {
                setUpload(false)
              }}
            />
          </Flex>
        )}
        {!upload && imageSrc && (
          <Box position="relative">
            <Image
              src={imageSrc}
              w={'100%'}
              {...props}
              objectFit="cover"
              border="1px solid"
              rounded="md"
              shadow="md"
              borderColor="gray.200"
              cursor="pointer"
              onClick={() => setUpload(true)}
              alt=""
            />
            <IconButton
              icon={<UploadIcon />}
              rounded="full"
              variant="ghost"
              position="absolute"
              bg="white"
              opacity=".15"
              color="primary"
              _hover={{ opacity: 1, bg: 'white' }}
              aria-label={''}
              p={2}
              mt="-5rem"
              onClick={() => {
                setUpload(true)
              }}
              ml="1rem"
            />
            <IconButton
              icon={<XIcon />}
              color="primary"
              rounded="full"
              margin="auto"
              onClick={() => {
                setUpload(false)
              }}
              bg="white"
              opacity=".15"
              _hover={{ opacity: 1, bg: 'white' }}
              aria-label={''}
              p={2}
              mt="-9.5rem"
              ml="5.5rem"
            />
          </Box>
        )}

        {file && (
          <HStack spacing={4} mt={4} justify="center">
            {file && (
              <Button color="info" size="lg" disabled={!previewSrc} onClick={onCancelFile}>
                Clear
              </Button>
            )}
            {file && (
              <Button size="lg" disabled={!previewSrc} colorScheme="accent" onClick={onSubmit}>
                Upload
              </Button>
            )}
          </HStack>
        )}
      </>
    )
  }
)

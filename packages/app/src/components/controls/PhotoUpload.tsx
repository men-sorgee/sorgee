import { ApiResponse } from "lib/utils/server";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  chakra,
  Flex,
  HStack,
  Icon,
  Image,
  ImageProps,
  Input,
  useToast
} from "@chakra-ui/react";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
        isClosable: true
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
          body: formData
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
            gap={4}
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
                as={ArrowUpTrayIcon}
                margin="auto"
              />
            </label>
            <Icon
              color="white"
              rounded="full"
              bg="primary"
              h="3em"
              w="3em"
              as={XMarkIcon}
              p={3}
              onClick={() => {
                setUpload(false)
                onClear()
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
          </Box>
        )}

        {file && (
          <HStack spacing={4} mt={4} justify="center">
            {file && (
              <Button
                color="info"
                size="lg"
                disabled={!previewSrc}
                onClick={onCancelFile}
              >
                Clear
              </Button>
            )}
            {file && (
              <Button
                size="lg"
                disabled={!previewSrc}
                colorScheme="accent"
                onClick={onSubmit}
              >
                Upload
              </Button>
            )}
          </HStack>
        )}
      </>
    )
  }
)

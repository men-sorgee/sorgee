import { useCallback, useRef, useState } from 'react'

import { Camera } from 'react-camera-pro'

import {
  AspectRatio,
  Box,
  Button,
  chakra,
  Circle,
  HStack,
  IconButton,
  Image,
  StackProps,
} from '@chakra-ui/react'
import { CameraIcon } from '@heroicons/react/24/solid'

type Props = StackProps & {
  onAccept: (base64Image: string) => void
  children?: React.ReactNode | React.ReactNode[]
  facingMode?: 'user' | 'environment'
}
const visible = (show: boolean) => (show ? 'inherit' : 'none')

export const PhotoCapture = chakra(({ children, onAccept, facingMode, ...props }: Props) => {
  const [image, setImage] = useState<string>(undefined)
  const camera = useRef(null)

  const accept = useCallback(() => {
    onAccept(image)
    setImage(null)
  }, [image, onAccept])

  if (typeof window == 'undefined') return null

  return (
    <>
      <Box shadow="md" bg="gray.300" p={4} rounded="lg" w="full" textAlign="center">
        <Box display={visible(image != undefined)} w="full">
          <AspectRatio mx="auto" mb={4} ratio={1} w="full">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <Image src={image} alt="upload" w="100%" rounded="md" />
          </AspectRatio>

          <HStack spacing={4} mx="auto" maxWidth="fit-content">
            <Button size="lg" p={4} colorScheme="primary" onClick={accept}>
              Accept
            </Button>

            <Button size="lg" p={4} colorScheme="secondary" onClick={() => setImage(null)}>
              Retake
            </Button>
          </HStack>
        </Box>

        <Box display={visible(image == undefined)} w="full">
          <AspectRatio ratio={1} mb={4} w="full" rounded="md">
            <Camera
              {...props}
              ref={camera}
              aspectRatio={1}
              facingMode={facingMode}
              errorMessages={{
                noCameraAccessible:
                  'No camera device accessible. Please connect your camera or try a different browser.',
                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                switchCamera:
                  'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.',
              }}
            />
          </AspectRatio>
          <Circle bg="primary.200" p={2} maxWidth="fit-content" mx="auto">
            <IconButton
              size="lg"
              colorScheme="ghost"
              color="white"
              icon={<CameraIcon height={50} />}
              onClick={() => {
                setImage(camera.current.takePhoto())
              }}
              aria-label={''}
              p={8}
            />
          </Circle>
        </Box>
        <Box {...props}>{children}</Box>
      </Box>
    </>
  )
})

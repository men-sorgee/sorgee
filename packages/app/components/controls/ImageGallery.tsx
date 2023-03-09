import { useCallback, useState } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { ImageModal } from './ImageModal'

export const ImageGallery = ({ images }: { images: string[] }) => {
  const [openIndex, setOpenIndex] = useState<number>(undefined)
  const [viewIndex, setViewIndex] = useState<number>(0)
  const showScroll = images?.length > 0

  const handleImageClick = useCallback((index) => {
    setOpenIndex(index)
  }, [])

  return (
    <Box position="relative" height="30vh" width={'full'} overflow={'hidden'}>
      {/* Left Icon */}
      {showScroll && (
        <IconButton
          icon={<ArrowLeftIcon />}
          aria-label="left-arrow"
          colorScheme="messenger"
          borderRadius="full"
          position="absolute"
          bg="transparent"
          color="accent.400"
          left={'1%'}
          top={'50%'}
          transform={'translate(0%, -50%)'}
          zIndex={2}
          hidden={viewIndex === 0}
          onClick={() => {
            setViewIndex(viewIndex - 1)
          }}
        />
      )}
      {/* Right Icon */}
      {showScroll && (
        <IconButton
          icon={<ArrowRightIcon />}
          aria-label="right-arrow"
          colorScheme="messenger"
          borderRadius="full"
          position="absolute"
          right={'1%'}
          top={'50%'}
          bg="transparent"
          color="accent.400"
          transform={'translate(0%, -50%)'}
          zIndex={2}
          hidden={viewIndex === images.length - 1}
          onClick={() => {
            setViewIndex(viewIndex + 1)
          }}
        />
      )}

      {images.map((url, index) => (
        <>
          <Box
            key={index}
            rounded="lg"
            shadow="lg"
            maxW="lg"
            mx="auto"
            h="full"
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundImage={`url(${url})`}
            backgroundSize="cover"
            hidden={viewIndex != index}
            onClick={() => {
              handleImageClick(index)
            }}
            cursor="pointer"
          >
            <ImageModal
              key={'modal-' + index}
              isOpen={openIndex === index}
              onClose={() => setOpenIndex(-1)}
              imageSrc={url}
            />
          </Box>
        </>
      ))}
    </Box>
  )
}

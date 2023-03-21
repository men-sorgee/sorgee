import { useCallback, useState } from 'react'
import { Box, HStack, IconButton, Stack } from '@chakra-ui/react'
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
    <HStack overflowX="auto">
      {images.map((url, index) => (
        <Box
          key={index}
          rounded="lg"
          shadow="lg"
          w="200px"
          h="200px"
          minW="200px"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundImage={`url('${url}?width=200&height=200&quality=60')`}
          backgroundSize="cover"
          onClick={() => {
            handleImageClick(index)
          }}
          cursor="pointer"
        >
          <ImageModal
            key={'modal-' + index}
            isOpen={openIndex === index}
            onClose={() => setOpenIndex(-1)}
            imageSrc={`${url}?&quality=100`}
          />
        </Box>
      ))}
    </HStack>
  )
}

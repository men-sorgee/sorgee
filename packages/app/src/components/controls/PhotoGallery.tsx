import { useCallback, useState } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import { LockOpenIcon } from '@heroicons/react/24/outline'

import { PhotoModal } from './PhotoModal'

export const PhotoGallery = ({
  images
}: {
  images: Array<{ src: string; private: boolean }>
}) => {
  const [openIndex, setOpenIndex] = useState<number>(undefined)

  const handleImageClick = useCallback((index) => {
    setOpenIndex(index)
  }, [])

  return (
    <HStack overflowX="auto">
      {images.map(({ src, private: showLock }, index) => (
        <Box
          key={index}
          position="relative"
          rounded="lg"
          shadow="lg"
          w="200px"
          h="200px"
          minW="200px"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundImage={`url('${src}?width=200&height=200&quality=60')`}
          backgroundSize="cover"
          onClick={() => {
            handleImageClick(index)
          }}
          cursor="pointer"
        >
          <PhotoModal
            key={'modal-' + index}
            isOpen={openIndex === index}
            onClose={() => setOpenIndex(-1)}
            imageSrc={`${src}?&quality=100`}
          />
          {showLock && (
            <LockOpenIcon
              title="Private Photo"
              style={{
                color: 'white',
                position: 'absolute',
                top: '5',
                right: '5',
                width: '20px',
                zIndex: 'popover'
              }}
            />
          )}
        </Box>
      ))}
    </HStack>
  )
}

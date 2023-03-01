import { Modal, ModalOverlay, ModalContent, ModalCloseButton, Image } from '@chakra-ui/react'

export const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton />
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <Image
          src={imageSrc}
          rounded="md"
          shadow="lg"
          alt="Large Image"
          objectFit="cover"
          maxH="80vh"
        />
      </ModalContent>
    </Modal>
  )
}

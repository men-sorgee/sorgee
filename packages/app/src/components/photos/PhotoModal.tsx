import {
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay
} from "@chakra-ui/react";

export const PhotoModal = ({ isOpen, onClose, imageSrc }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />

      <ModalContent m={4}>
        <ModalCloseButton />
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <Image
          src={`${imageSrc}`}
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

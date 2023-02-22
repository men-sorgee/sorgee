import {
  Modal,
  ModalProps,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  chakra,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react'
import { ReactNode } from 'react'

type Props = ModalProps & {
  header?: ReactNode | ReactNode[]
  children: ReactNode | ReactNode[]
  footer?: ReactNode | ReactNode[]
  isOpen: boolean
  onClose: () => void
}
export const ModalPopup = chakra(
  ({ header, footer, isOpen, onClose, children, ...props }: Props) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered {...props}>
        <ModalOverlay />
        <ModalContent bg="transparent" shadow="none">
          <ModalCloseButton />
          <ModalHeader>{header}</ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalFooter>{footer}</ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
)

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
      <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose} isCentered {...props}>
        <ModalOverlay />
        <ModalContent bg="transparent" m={0} p={0} shadow="none">
          <ModalCloseButton />
          {header && <ModalHeader>{header}</ModalHeader>}
          <ModalBody m={0} p={0}>
            {children}
          </ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalContent>
      </Modal>
    )
  }
)

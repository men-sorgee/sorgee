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
  useColorModeValue,
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
    const bg = useColorModeValue('white', 'gray.800')
    return (
      <Modal scrollBehavior="outside" isOpen={isOpen} onClose={onClose} isCentered {...props}>
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent bg={bg} m={0} p={0} rounded="lg" shadow="lg">
          <ModalCloseButton color="white" />
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

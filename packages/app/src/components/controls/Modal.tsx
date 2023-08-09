import { ReactNode } from "react";

import {
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useColorModeValue
} from "@chakra-ui/react";

export type ModalPopupProps = ModalProps & {
  header?: ReactNode | ReactNode[]
  children: ReactNode | ReactNode[]
  footer?: ReactNode | ReactNode[]
  isOpen: boolean
  onClose: () => void
}
export const ModalPopup = chakra(
  ({ header, footer, isOpen, onClose, children, ...props }: ModalPopupProps) => {
    const bg = useColorModeValue('white', 'gray.800')
    return (
      <Modal
        scrollBehavior="outside"
        size={['full', 'lg']}
        isOpen={isOpen}
        onClose={onClose}
        {...props}
      >
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent bg={bg} mt={[0, 10, 20]} ml={[0, -2]} p={0} rounded="lg" shadow="lg">
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

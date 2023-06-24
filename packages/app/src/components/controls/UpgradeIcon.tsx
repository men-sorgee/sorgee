import { useRef } from 'react'
import { MembershipType } from 'lib/models'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  IconButtonProps,
  useDisclosure
} from '@chakra-ui/react'
import { ButtonLink } from './ButtonLink'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  title: string
  icon: React.ReactElement
  membershipType: MembershipType
}

const UpgradeIcon = ({ title, icon, membershipType, ...props }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  return (
    <>
      <Box>
        <IconButton
          aria-label={title}
          title={title}
          variant="primary"
          zIndex="fixed"
          icon={icon}
          onClick={onOpen}
          color={'gray.300'}
          stroke={'gray.300'}
          ref={cancelRef}
          {...props}
        />
      </Box>
      <AlertDialog
        size={'lg'}
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogCloseButton />
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Upgrade Required
            </AlertDialogHeader>

            <AlertDialogBody>
              This feature is only available with our paid plans. Upgrade your
              plan to add this and other features to your account.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <ButtonLink
                colorScheme="red"
                href={`/member/account?plan=${membershipType}`}
                ml={3}
              >
                Upgrade
              </ButtonLink>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export { UpgradeIcon }

import React, { useRef } from 'react'
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
  useDisclosure,
  chakra
} from '@chakra-ui/react'
import { ButtonLink } from './ButtonLink'

type Props = Omit<IconButtonProps, 'aria-label'> & {
  title: string
  membershipType: MembershipType
}

const UpgradeIcon = chakra(
  ({
    title,
    icon,
    membershipType,
    size = ['sm', 'md', 'lg'],
    ...props
  }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()

    return (
      <>
        <IconButton
          variant="ghost"
          icon={icon}
          zIndex="fixed"
          color={'gray.100'}
          stroke={'gray.100'}
          onClick={onOpen}
          aria-label={title}
          title={title}
          ref={cancelRef}
          size={size}
          p={0}
          {...props}
        />

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
                plan to the{' '}
                <strong style={{ textTransform: 'capitalize' }}>
                  {MembershipType[membershipType]} Plan
                </strong>{' '}
                to add this and other features to your account.
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
)

export { UpgradeIcon }

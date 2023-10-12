import { ButtonLink } from "components";
import { MembershipType } from "lib/models";
import { useRef } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  chakra,
  IconButton,
  IconButtonProps,
  useDisclosure
} from "@chakra-ui/react";

export type UpgradeIconProps = Omit<IconButtonProps, 'aria-label'> & {
  title: string
  membershipType: MembershipType
}

const UpgradeIcon = chakra(
  ({ title, icon, membershipType, size = ['sm', 'md', 'lg'], ...props }: UpgradeIconProps) => {
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
          px={[.1, .5]}
          {...props}
        />

        <AlertDialog size={'lg'} isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogCloseButton />
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Upgrade Required
              </AlertDialogHeader>

              <AlertDialogBody>
                This feature is only available with our paid plans. Upgrade your plan to the{' '}
                <strong style={{ textTransform: 'capitalize' }}>
                  {MembershipType[membershipType]} Plan
                </strong>{' '}
                to add this and other features to your account.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={onClose}>Cancel</Button>
                <ButtonLink
                  colorScheme="red"
                  href={`/member/subscription?plan=${membershipType}`}
                  ml={3}
                  onClick={() => {
                    onClose()
                    return false
                  }}
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

export { UpgradeIcon };


import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Box,
  Button,
  useDisclosure,
  IconButton
} from '@chakra-ui/react'
import { useRef } from 'react'
import { useRouter } from 'next/router';
import { Member, MemberLevel, MembershipType } from 'lib/models'
import Subscribe from '../../pages/api/subscribe';
import { addBuddy } from 'lib/services/directus/server/users';


type Props = {
  title: string;
  icon: React.ReactElement;
  membershipType: MembershipType
}

const UpgradeIcon = ({ title, icon, membershipType }: Props) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose,  } = useDisclosure()
  const cancelRef = useRef()

  const onUpgrade = () => {
    router.push('/pricing', {
      query: {
        plan: membershipType
      }
    })
  }

  return (
    <>
      <Box>
        <IconButton
          aria-label={title}
          title={title}
          variant="primary"
          zIndex="fixed"
          size="lg"
          icon={icon}
          onClick={onOpen}
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
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Upgrade Required
            </AlertDialogHeader>

            <AlertDialogBody>
              This feature is only available with our paid plans. Upgrade your plan to add
              this and other features to your account.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={onUpgrade} ml={3}>
                Upgrade
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export { UpgradeIcon }

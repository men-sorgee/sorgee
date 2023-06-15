import { useRef } from 'react'

import { MembershipType } from 'lib/models'
import { useRouter } from 'next/router'

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
  useDisclosure
} from '@chakra-ui/react'

import { ButtonLink } from './ButtonLink'

type Props = {
  title: string
  icon: React.ReactElement
  membershipType: MembershipType
}

const UpgradeIcon = ({ title, icon, membershipType }: Props) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const onUpgrade = async () => {
    await router.push('/subscription/pricing', {
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
          color={'gray.300'}
          stroke={'gray.300'}
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
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <ButtonLink
                colorScheme="red"
                href={`/subscription/pricing?plan=${membershipType}`}
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

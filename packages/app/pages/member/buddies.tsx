import Page from 'components/Page'
import { useUser } from 'hooks'
import { MemberLevel, SearchableMember, User, UserBuddy, FieldMap } from 'lib/models'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { MemberCard, MemberSpotlight } from 'components/controls'
import { useEffect, useState } from 'react'
import { NextPageContext } from 'next'

export type PageProps = {
  fieldMap: FieldMap
}

export async function getServerSideProps(context: NextPageContext): Promise<{ props: PageProps }> {
  const { getFields } = await import('lib/services/directus/server')
  const fieldMap = await getFields('users')
  return {
    props: {
      fieldMap,
    },
  }
}

export default function BuddiesPage({ fieldMap }: PageProps) {
  const { member, loading } = useUser(MemberLevel.brother)
  const buddies = member?.buddies as UserBuddy[]
  const members = buddies?.map((buddy) => buddy.buddy_id as User)
  const [id, setId] = useState<string>(undefined)
  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    if (id) {
      onOpen()
    } else {
      onClose()
    }
  }, [id, setId, onOpen, onClose])

  return (
    <Page title="Buddies" loading={loading}>
      <SimpleGrid my={4} columns={[1, 1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
        {members &&
          members?.map((u: User) => (
            <MemberCard
              key={u.id}
              size="2xl"
              member={u as unknown as SearchableMember}
              onClick={() => {
                setId(u.id)
              }}
            />
          ))}
      </SimpleGrid>
      <Modal
        size={['full', 'xl', '2xl', '3xl', '5xl']}
        isOpen={isOpen}
        onClose={() => setId(undefined)}
      >
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent ml={-4} bg={useColorModeValue('white', 'black')}>
          <ModalBody p={0} rounded="md">
            <ModalCloseButton color={'white'} mt={2} />
            <MemberSpotlight full id={id} fields={fieldMap}></MemberSpotlight>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Page>
  )
}

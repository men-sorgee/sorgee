import Page from 'components/Page'
import { useUser } from 'hooks'
import { MemberLevel, SearchableMember, User, UserBuddy } from 'lib/models'
import {
  Flex,
  SimpleGrid,
  Text,
  Alert,
  Switch,
  Spacer,
  Link,
} from '@chakra-ui/react'
import { MemberCard, MemberModal } from 'components/controls'
import { useState } from 'react'
import NextLink from 'next/link'
import { FieldSwitch } from 'components/forms'

export type PageProps = {}

export default function BuddiesPage({}: PageProps) {
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [memberId, setMemberId] = useState<string>(undefined)
  const { member, loading } = useUser({
    minLevel: MemberLevel.brother,
  })

  const buddies = member?.buddies as UserBuddy[]
  let members = buddies?.map((buddy) => buddy.buddy_id as User)
  let onlineMembers = members?.filter((m) => m.presence == 'online')
  if (onlineOnly) {
    members = onlineMembers
  }

  return (
    <Page title="Buddies" loading={loading} requireAuth={true}>
      <Alert
        bg={'primary.300'}
        color="white"
        flexDirection={['column', 'row']}
        alignItems="start"
        justifyItems="space-between"
        my={4}
        p={4}
        borderRadius="md"
        shadow="md"
        gap={4}
      >
        <Text mt={0} fontSize="xl">
          These are your buddies. They are the people you added to your buddy list. You can add
          buddies from the{' '}
          <Link textDecoration="underline" as={NextLink} href="/members">
            members directory
          </Link>
          . You have {buddies?.length} buddies with {onlineMembers?.length} online.
        </Text>
        <Spacer />
        <Flex direction="column" align="center" justify="space-around" minWidth={['full', '15%']}>
          <Text as="label" htmlFor="onlineOnly" fontWeight="bold" m={0}>
            Online Only
          </Text>
          <Switch
            id="onlineOnly"
            mt={4}
            defaultChecked={onlineOnly}
            onChange={(e) => setOnlineOnly(e.target.checked)}
          />
        </Flex>
      </Alert>
      <SimpleGrid my={4} columns={[1, 1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
        {members &&
          members?.map((u: User) => (
            <MemberCard
              key={u.id}
              size={['md', 'lg', 'xl']}
              member={u as unknown as SearchableMember}
              onClick={() => {
                setMemberId(u.id)
              }}
            />
          ))}
      </SimpleGrid>
      <MemberModal
        isOpen={memberId != undefined}
        memberId={memberId}
        onClose={() => setMemberId(undefined)}
      />
    </Page>
  )
}

import { useState } from 'react'

import { Lazy, MemberCard, MemberModal } from 'components/controls'
import Page from 'components/Page'
import { useUser } from 'hooks'
import { MemberLevel, SearchableMember, User, UserBuddy } from 'lib/models'

import { Alert, Flex, SimpleGrid, Spacer, Switch, Text } from '@chakra-ui/react'

export type PageProps = {}

export default function BuddiesPage({}: PageProps) {
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [memberId, setMemberId] = useState<string>(undefined)
  const { member, loading } = useUser({
    minLevel: MemberLevel.brother,
    requiredFeature: 'buddy_list',
    redirectsEnabled: true
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
        bg={'secondary.300'}
        color="white"
        flexDirection={['column', 'row']}
        alignItems="start"
        justifyItems="space-between"
        my={4}
        p={4}
        borderRadius="md"
        shadow="md"
        gap={2}
      >
        <Text mt={0} fontSize={['md', 'lg', 'xl']}>
          You have {buddies?.length} buddies with {onlineMembers?.length}{' '}
          online.
        </Text>
        <Spacer />
        <Flex
          direction="column"
          align="center"
          justify="space-around"
          minWidth={['full', '15%']}
        >
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
      <SimpleGrid
        my={4}
        columns={[1, 1, 1, 2]}
        spacing={4}
        w="full"
        justifyItems="stretch"
      >
        {members &&
          members?.map((u: User) => (
            <Lazy key={u.id}>
              <MemberCard
                key={u.id}
                size={['md', 'lg', 'xl']}
                member={u as unknown as SearchableMember}
                viewer={member}
                onClick={() => {
                  setMemberId(u.id)
                }}
              />
            </Lazy>
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

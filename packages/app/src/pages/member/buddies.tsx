import { useState } from 'react'

import { Lazy, MemberCard, MemberModal } from 'components/controls'
import Page from 'components/Page'
import { useUser } from 'hooks'
import { MemberLevel, SearchableMember, User, UserBuddy } from 'lib/models'

import {
  Alert,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spacer,
  Switch,
  Text
} from '@chakra-ui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export type PageProps = {}

export default function BuddiesPage({}: PageProps) {
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [memberId, setMemberId] = useState<string>(undefined)
  const [search, setSearch] = useState<string>(undefined)
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
      <InputGroup size="lg">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="80%"
            rounded="full"
            size="sm"
            onClick={() => setSearch('')}
            title="Clear Search"
          >
            <XMarkIcon width="20px" />
          </Button>
        </InputRightElement>
      </InputGroup>

      <SimpleGrid
        my={4}
        columns={[1, 1, 1, 2]}
        spacing={4}
        w="full"
        justifyItems="stretch"
      >
        {members &&
          members
            ?.filter((u) =>
              search
                ? u.nickname
                    ?.toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase())
                : true
            )
            .map((u: User) => (
              <Lazy key={u.id}>
                <MemberCard
                  key={u.id}
                  size={['md', 'lg', 'xl']}
                  member={u as unknown as SearchableMember}
                  viewer={member}
                  full
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

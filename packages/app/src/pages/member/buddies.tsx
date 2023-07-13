import { useState } from 'react'

import { Lazy, MemberCard, MemberModal } from 'components/controls'
import Page from 'components/Page'
import { useUser } from 'hooks'
import {
  Member,
  MemberLevel,
  SearchableMember,
  User,
  UserBuddy
} from 'lib/models'
import swr from 'swr'
import {
  Alert,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spacer,
  Switch,
  Text
} from '@chakra-ui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { JsonFetcher } from '../../lib/utils'

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

  const { data: buddies, isLoading } = swr<SearchableMember[]>(
    '/api/member/buddy',
    JsonFetcher,
    {
      refreshInterval: 1000 * 60 * 5,
      revalidateIfStale: true,
      revalidateOnFocus: true,
      refreshWhenOffline: true,
      refreshWhenHidden: true,
      fallbackData: []
    }
  )

  let members = buddies?.map((b) => b) || []
  const onlineMembers = buddies?.filter((m) => m.presence == 'online') || []
  if (onlineOnly) {
    members = onlineMembers
  }

  return (
    <Page title="Buddies" loading={loading || isLoading} requireAuth={true}>
      <Text mt={0} fontSize={['md', 'lg', 'xl']}>
        Buddies are guys you are want to keep in touch with. You can see their
        online status easily from here.
      </Text>

      <Flex
        direction={['column', 'column', 'row']}
        align="center"
        textAlign={['center', 'center', 'left']}
        justify="space-around"
        minWidth={['full', '15%']}
        bg="gray.700"
        p={4}
        rounded="md"
        shadow="md"
        gap={4}
        mt={4}
      >
        <InputGroup size="lg" w={['full', 'full', '50%']}>
          <Flex alignItems="center" direction="row" gap={4} mr={4}>
            <FormLabel htmlFor="onlineOnly" p={0} m={0}>
              Online
            </FormLabel>
            <Switch
              id="onlineOnly"
              mt={1}
              title="Online Only"
              defaultChecked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
            ></Switch>
          </Flex>
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
          />
          {search && (
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
          )}
        </InputGroup>
        <Text align="center" w={['full', 'full', '40%']}>
          You have {buddies?.length} buddies with {onlineMembers?.length}{' '}
          online.
        </Text>
      </Flex>

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
            ?.map((u: SearchableMember) => (
              <Lazy key={u.id}>
                <MemberCard
                  key={u.id}
                  size={['md', 'lg', 'xl']}
                  member={u}
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

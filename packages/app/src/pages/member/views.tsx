import { Lazy, MemberCard, MemberModal, Page } from "components";
import { useUser } from "hooks";
import { MemberLevel, UserViews } from "lib/models";
import { JsonFetcher } from "lib/utils";
import { useState } from "react";
import swr from "swr";

import {
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Switch,
  Text
} from "@chakra-ui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export type PageProps = {}

export default function ViewersPage({ }: PageProps) {
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [memberId, setMemberId] = useState<string>(undefined)
  const [search, setSearch] = useState<string>(undefined)
  const { member, loading, level } = useUser({
    minLevel: MemberLevel.brother,
    requiredFeature: 'my_views',
    redirectsEnabled: true,
  })

  const { data: views, isLoading } = swr<UserViews>('/api/my/views', JsonFetcher, {
    refreshInterval: 1000 * 60 * 5,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    refreshWhenOffline: true,
    refreshWhenHidden: true
  })

  let members = views?.users || []
  const onlineMembers = members?.filter((m) => m.user.presence == 'online') || []
  if (onlineOnly) {
    members = onlineMembers
  }

  return (
    <Page title="Viewers" loading={loading || isLoading}>
      <Text mt={0} fontSize={['md', 'lg', 'xl']} textAlign='center'>
        Viewers are guys that checked you out.
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
          You have {members?.length} viewers with {onlineMembers?.length} online.
        </Text>
      </Flex>

      <SimpleGrid my={4} columns={[1, 1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
        {members &&
          members
            ?.filter((u) =>
              search ? u.user.nickname?.toLocaleLowerCase().includes(search.toLocaleLowerCase()) : true
            )
            ?.map((u) => (
              <Lazy key={u.user.id}>
                <MemberCard
                  key={u.user.id}
                  size={['md', 'lg', 'xl']}
                  member={u.user}
                  viewer={member}
                  onClick={() => {
                    setMemberId(u.user.id)
                  }}
                >
                  {level == MemberLevel.staff && (<>
                    <Text mt={0} textAlign={'center'}>View Count:</Text>
                    <Heading m={0} as='h3' textAlign={'center'}> {u.count}</Heading></>)}
                </MemberCard>
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

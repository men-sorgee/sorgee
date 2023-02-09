import { ManyItems } from '@directus/sdk'
import Page from 'components/Page'
import { useMember } from 'hooks/use-member'
import { UserAddIcon, StarIcon, ChatIcon } from '@heroicons/react/solid'
import { pruneUndefined } from 'lib/utils'
import { useCallback, useEffect, useState } from 'react'
import { capitalCase } from 'change-case'
import { Loading, UserCard } from 'components/ui'
import { ArrowRightIcon, ArrowLeftIcon, ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import {
  Divider,
  Flex,
  HStack,
  Stat,
  StatGroup,
  Select,
  Checkbox,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Tooltip,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardFooter,
  CardHeader,
  CardBody,
  Link,
  useColorModeValue,
  Badge,
  Wrap,
  useDisclosure,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  LinkBox,
  LinkOverlay,
  Spacer,
  GridItem,
} from '@chakra-ui/react'
import useSWR from 'swr'
import {
  User,
  DirectusField,
  SearchableMember,
  searchableMemberFields,
  memberProfileExplicitFields,
  memberProfileLocationFields,
  memberInterestFields,
  memberProfileFields,
  memberHealthFields,
  memberEventFields,
  UserType,
  MemberLevel,
  Member,
  memberProfileContactFields,
} from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import { useRouter } from 'next/router'
import { Rating } from 'components/ui'
import useMemberSearch from 'hooks/use-members'
import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FieldCheckboxes } from 'components/forms'

type PageProps = Partial<SearchableMember> & {
  page: number
  size: number
  sort: string
  fieldMap: Record<string, DirectusField>
}

export async function getServerSideProps(context: NextPageContext) {
  const { getFields } = await import('lib/services/directus/server')
  const { page, size, sort = '-presence', user_type = '', ...filters } = context.query

  const fields = await getFields('users')
  const fieldMap = fields.reduce((acc, field) => {
    acc[field.field] = field
    return acc
  }, {} as Record<string, DirectusField>)

  const props: PageProps = {
    page: Number(page || 1),
    size: Number(size || 10),
    sort: sort as string,
    fieldMap,
    ...(filters as Partial<SearchableMember>),
  }
  return { props }
}

export default function MemberListPage({
  fieldMap: fields,
  page,
  size,
  sort,
  ...filters
}: PageProps) {
  const router = useRouter()
  const { page: _1, size: _2, sort: _3, ...q } = router.query
  const [query, setQuery] = useState<Partial<SearchableMember>>(q)
  const { member, loading } = useMember()
  const memberLevel = MemberLevel[member?.user_type || 'subscriber']

  const methods = useForm<Partial<SearchableMember>>({
    mode: 'onBlur',
    defaultValues: query,
  })

  useEffect(() => {
    if (!loading && query == null && filters) {
      setQuery(filters)
    }
  }, [loading, query, filters])

  const searchMembers = useCallback(
    (p: number, z: number, s: string, d: Partial<SearchableMember>) => {
      let query = pruneUndefined(
        {
          page: p,
          size: z,
          sort: s,
          ...d,
        },
        (v) => v != false
      )
      router
        .replace({
          pathname: '/members',
          query,
        })
        .then(() => {
          setQuery(d)
        })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, query]
  )

  const setPage = (p: number) => {
    searchMembers(p, size, sort, query)
  }
  const setSize = (s: number) => {
    searchMembers(1, s, sort, query)
  }
  const setSort = (s: string) => {
    searchMembers(page, size, s, query)
  }

  const key = `/api/members?limit=${size}&offset=${
    size * (page - 1)
  }&sort=${sort}&${new URLSearchParams(query as any).toString()}`
  const {
    data: response,
    error,
    isLoading,
  } = useSWR<ManyItems<Partial<SearchableMember>>>(key, JsonFetcher)
  const [meta, setMeta] = useState<{ total: number; filtered: number }>({
    total: 0,
    filtered: 0,
  })
  const [pageCount, setPageCount] = useState(0)
  const [members, setMembers] = useState<SearchableMember[]>([])
  useEffect(() => {
    if (!loading && !isLoading && response?.data) {
      setMeta({
        total: response?.meta?.total_count || 0,
        filtered: response?.meta?.filter_count || 0,
      })
      setPageCount(Math.ceil(meta?.filtered ? meta.filtered / size : 1))
      setMembers(response.data)
    }
  }, [
    loading,
    isLoading,
    members,
    meta?.filtered,
    response?.data,
    response?.meta?.filter_count,
    response?.meta?.total_count,
    size,
  ])

  const pageIndex = page - 1
  return (
    <Page title="Members" loading={loading} w="full" requireAuth={true}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) => {
            searchMembers(1, size, sort, data)
          })}
          style={{ width: '100%' }}
        >
          <Accordion allowToggle w="full">
            <AccordionItem>
              <AccordionButton>
                <Flex direction="row" pr={4} gap={4} justify="space-between" w="full">
                  <h3>Filter Members</h3>
                  <StatGroup as={HStack} spacing={4}>
                    <Stat colorScheme="primary">
                      <StatLabel>Total</StatLabel>
                      <StatNumber>{meta.total}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Filtered</StatLabel>
                      <StatNumber>{meta.filtered}</StatNumber>
                    </Stat>
                  </StatGroup>
                </Flex>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel>
                <FieldCheckboxes
                  field="user_type"
                  label="Level"
                  options={fields['user_type'].meta.options.choices}
                />
                <FieldCheckboxes
                  field="spectrum"
                  label="Orientation"
                  options={fields['spectrum'].meta.options.choices}
                />
                <FieldCheckboxes
                  field="mannerisms"
                  label="Mannerisms"
                  options={fields['mannerisms'].meta.options.choices}
                />
                <FieldCheckboxes
                  field="relationship_status"
                  label="Relationship Status"
                  options={fields['relationship_status'].meta.options.choices}
                />
                <FieldCheckboxes
                  field="my_positions"
                  label="Positions"
                  options={fields['my_positions'].meta.options.choices}
                />
                <Button size="lg" type="submit" colorScheme="blue">
                  Search
                </Button>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Flex gap={4} mt={4}>
            <Select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value))
                setPage(1)
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
            <Select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as any)
              }}
            >
              <option value="-presence">Online</option>
              <option value="-last_login">Recently Online</option>
              <option value="nickname">By Username</option>
              <option value="-user_type">By Level</option>
              <option value="-rating">Highest Rated</option>
            </Select>
          </Flex>

          <SimpleGrid my={5} columns={[1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
            {members?.map((member: SearchableMember) => (
              <MemberCard key={member.id} member={member} fields={fields} />
            ))}
          </SimpleGrid>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex>
              <IconButton
                onClick={() => setPage(1)}
                isDisabled={pageIndex == 0}
                icon={<ArrowLeftIcon h={3} w={3} />}
                mr={4}
                aria-label="First Page"
              />
              <IconButton
                onClick={() => setPage(page - 1)}
                isDisabled={pageIndex == 0}
                icon={<ChevronLeftIcon h={6} w={6} />}
                aria-label="Previous Page"
              />
            </Flex>

            <Flex alignItems="center">
              <Text flexShrink="0" mx={8}>
                <Text fontWeight="bold" as="span">
                  {page}
                </Text>
                {' / '}
                <Text fontWeight="bold" as="span">
                  {pageCount}
                </Text>
              </Text>
            </Flex>
            <Flex>
              <IconButton
                onClick={() => setPage(page + 1)}
                isDisabled={pageCount == 0 || page >= pageCount}
                icon={<ChevronRightIcon h={6} w={6} />}
                aria-label="Next Page"
              />

              <IconButton
                onClick={() => setPage(pageCount)}
                isDisabled={pageIndex + 1 == pageCount}
                icon={<ArrowRightIcon h={3} w={3} />}
                ml={4}
                aria-label="Last Page"
              />
            </Flex>
          </Flex>
        </form>
      </FormProvider>
    </Page>
  )
}

function PropertyGroup({
  key,
  member,
  show,
  fieldList,
  fields,
  color,
  maxCols = 3,
}: {
  key: string
  member: Member
  show: boolean
  fieldList: string[]
  fields: Record<string, DirectusField>
  color: string
  maxCols?: number
}) {
  if (!show) return null
  const getValue = (field: string, value: string) => {
    if (fields[field]?.meta?.options?.choices) {
      const option = fields[field].meta.options.choices.find((choice: any) => choice.value == value)
      return option?.text
    }
    return value
  }
  return (
    <SimpleGrid key={key} columns={[1, 2, maxCols]} spacing={1} alignItems="start">
      {fieldList?.map((field, i: number) => (
        <>
          {member[field] &&
            (Array.isArray(member[field]) ? (
              <GridItem key={`${key}-item-${i}`} colSpan={[1, 2, maxCols]}>
                <h5>{capitalCase(fields[field].field)}:</h5>
                <Wrap gap={2}>
                  {member[field]?.map((item: any, d: number) => (
                    <Badge colorScheme={color} key={`badge-${d}`}>
                      {getValue(field, item)}
                    </Badge>
                  ))}
                </Wrap>
              </GridItem>
            ) : (
              <GridItem key={`${key}-item-${i}`}>
                <h5>{capitalCase(fields[field].field)}:</h5>
                <h4 style={{ textTransform: 'capitalize' }}>{getValue(field, member[field])}</h4>
              </GridItem>
            ))}
        </>
      ))}
    </SimpleGrid>
  )
}

function MemberSpotlight({
  member: { id },
  fields,
}: {
  member: Partial<SearchableMember>
  fields: Record<string, DirectusField>
}) {
  const { member, loading } = useMember(id)
  if (loading || !member) return <Loading />

  return (
    <Flex direction="column" mb={2} align="start" justify="stretch" gap={2} w="full">
      <Text>{member?.biography}</Text>

      <Tabs isFitted fontSize={{ base: 'sm', md: 'lg' }} w="full">
        <TabList>
          <Tab>General</Tab>
          <Tab>Sexual</Tab>
          <Tab>Interests</Tab>
          {/**<Tab>Location</Tab>**/}
          <Tab>Health</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PropertyGroup
              key="profile"
              member={member}
              fieldList={memberProfileFields}
              show={member?.show_profile}
              fields={fields}
              color="green"
            />
          </TabPanel>
          <TabPanel>
            <PropertyGroup
              key="explicit"
              member={member}
              fieldList={memberProfileExplicitFields}
              show={member?.show_explicit}
              fields={fields}
              color="red"
            />
          </TabPanel>
          <TabPanel>
            <PropertyGroup
              key="interests"
              member={member}
              fieldList={memberInterestFields}
              show={member?.show_interests}
              fields={fields}
              color="blue"
            />
          </TabPanel>
          {/**<TabPanel>
            <PropertyGroup
              member={member}
              fieldList={memberProfileLocationFields}
              show={member?.show_location}
              fields={fields}
              color="purple"
            />
          </TabPanel>
          {**/}
          <TabPanel>
            <PropertyGroup
              key="health"
              member={member}
              fieldList={memberHealthFields}
              show={member?.show_health}
              fields={fields}
              color="orange"
              maxCols={2}
            />
          </TabPanel>
          <TabPanel>
            <PropertyGroup
              key="contact"
              member={member}
              fieldList={memberProfileContactFields}
              show={member?.show_contact}
              fields={fields}
              color="orange"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

function MemberCard({
  member,
  fields,
}: {
  member: Partial<SearchableMember>
  fields: Record<string, DirectusField>
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cardBg = useColorModeValue('white', 'black')

  return (
    <>
      <LinkBox as="article" key={member?.id} onClick={onOpen}>
        <Card
          w="full"
          h="full"
          bg={cardBg}
          border="1px solid transparent"
          borderColor="accent.700"
          _hover={{ shadow: '2xl', borderColor: 'accent.500' }}
        >
          <CardHeader>
            <UserCard user={member} />
            <Flex justify="end" align="end" mt={-1} mb={2} w="full">
              {member?.spectrum && (
                <Badge size={'lg'} colorScheme="blue" rounded={0}>
                  {member.spectrum}
                </Badge>
              )}
              {member?.relationship_status && (
                <Badge size={'lg'} colorScheme="red" rounded={0}>
                  {member.relationship_status}
                </Badge>
              )}
            </Flex>
            <Divider />
          </CardHeader>
          <CardBody>
            <Text noOfLines={2}>{member?.biography}</Text>
          </CardBody>
          <CardFooter>
            <Spacer />
            {member?.rating > 0 && (
              <Rating
                value={member.rating || 0}
                mt={2}
                aria-label="User Rating"
                size={['xs']}
                simple
              />
            )}
          </CardFooter>
        </Card>
      </LinkBox>
      <Modal size="2xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent bg={cardBg} border="1px solid transparent" borderColor="accent.700">
          <ModalHeader>
            <Flex direction="column" justify="flex-start" align="top">
              <UserCard user={member} size="xl" />
              <Flex align="stretch" justify="stretch" mt={4}>
                {member?.spectrum && (
                  <Badge size={'lg'} colorScheme="blue">
                    {member.spectrum}
                  </Badge>
                )}
                {member?.relationship_status && (
                  <Badge size={'lg'} colorScheme="secondary">
                    {member.relationship_status}
                  </Badge>
                )}
              </Flex>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MemberSpotlight member={member} fields={fields} />
          </ModalBody>
          <ModalFooter>
            <Flex justify="space-between" align="center">
              <IconButton
                aria-label="Add Buddy"
                disabled={true}
                icon={<UserAddIcon fill="primary.300" />}
                variant="ghost"
              />
              <IconButton
                aria-label="Favorite"
                disabled={true}
                icon={<StarIcon fill="yellow.300" />}
                variant="ghost"
              />
              <IconButton
                aria-label="Message"
                disabled={true}
                icon={<ChatIcon fill="blue.300" />}
                variant="ghost"
              />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

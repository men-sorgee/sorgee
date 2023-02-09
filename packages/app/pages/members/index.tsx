import { ManyItems } from '@directus/sdk'
import Page from 'components/Page'
import { signIn } from 'next-auth/react'
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
import NextLink from 'next/link'
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
  getAllowedUsers,
} from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import { useRouter } from 'next/router'
import { Rating } from 'components/ui'
import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FieldCheckboxes } from 'components/forms'

type PageProps = Record<string, string[]> & {
  fieldMap: Record<string, DirectusField>
  id?: string
}

export async function getServerSideProps(context: NextPageContext): Promise<{ props: PageProps }> {
  const { getFields } = await import('lib/services/directus/server')
  const fields = await getFields('users')
  const fieldMap = fields.reduce((acc: any, field: DirectusField): any => {
    acc[field.field] = field
    return acc
  }, {} as Record<string, DirectusField>)

  return {
    props: {
      fieldMap,
      ...context.query,
    },
  }
}

export default function MemberListPage(props: PageProps) {
  const router = useRouter()
  const { fieldMap: fields, id: i, ...params } = props
  const { page: p, size: s, sort: o, ...q } = router.query || params
  const [id, setId] = useState(i)
  const [page, $setPage] = useState(1)
  const [size, $setSize] = useState(10)
  const [sort, $setSort] = useState('-presence')
  const [query, setQuery] = useState<Record<string, string | string[]>>(q)
  const [key, setKey] = useState(`/api/members?limit=${size}&offset=${page * size}&sort=${sort}`)
  const { member: currentMember, loading } = useMember()
  const [meta, setMeta] = useState<{ total: number; filtered: number }>({
    total: 0,
    filtered: 0,
  })
  const [pageCount, setPageCount] = useState(0)
  const [members, setMembers] = useState<SearchableMember[]>([])
  const allowedUserTypes = getAllowedUsers(MemberLevel[currentMember?.user_type || 'inductee'])
  useEffect(() => {
    if (!loading && !currentMember) {
      signIn()
    }
    if (!loading && currentMember) {
      if (p && Number(p) != page) $setPage(Number(p))
      if (s && Number(s) != size) $setSize(Number(s))
      if (o && (o as string) != sort) $setSort(o as string)
      if (q) {
        setQuery(
          Object.entries(q)?.reduce(
            (acc, [k, v]) => ({ ...acc, [k]: Array.isArray(v) ? v : [v] }),
            {}
          )
        )
      }
      if (p || s || o || q) {
        const search = new URLSearchParams(q as any).toString()
        setKey(
          `/api/members?limit=${s || 10}&offset=${Number(s || 10) * (Number(p || 1) - 1)}&sort=${
            o || '-presence'
          }&${search}`
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const searchMembers = useCallback(
    (p: number, s: number, o: string, d: Record<string, string | string[]>) => {
      let search = pruneUndefined(
        {
          page: p,
          size: s,
          sort: o,
          ...d,
        },
        (v) => v != false
      )
      let filter = Object.entries(d || {}).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: Array.isArray(v) ? v : [v] }),
        {}
      )
      router
        .replace({
          pathname: '/members',
          query: search,
        })
        .then(() => {
          setQuery(filter)
        })

      setKey(`/api/members?limit=${size}&offset=${size * page}&sort=${sort}&${filter}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, size, sort, query, key]
  )

  const methods = useForm<Record<string, string | string[]>>({
    mode: 'onBlur',
    defaultValues: query,
  })

  const setPage = (p: number) => {
    $setPage(p)
    searchMembers(p, Number(s) || size, (o as string) || sort, query)
  }
  const setSize = (s: number) => {
    $setSize(s)
    searchMembers(1, s, (o as string) || sort, query)
  }
  const setSort = (o: string) => {
    $setSort(o)
    searchMembers(Number(p) || page, Number(s) || size, o, query)
  }

  const { data: response } = useSWR<ManyItems<Partial<SearchableMember>>>(key, JsonFetcher)

  useEffect(() => {
    if (response?.data && response?.meta) {
      const { total_count, filter_count } = response.meta
      setMeta({
        total: total_count || 0,
        filtered: filter_count || 0,
      })
      setPageCount(Math.ceil((filter_count || size) / size))
      setMembers(response.data)
    }
  }, [size, page, sort, response?.data, response?.meta, key])

  const pageIndex = page - 1

  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    if (id) {
      onOpen()
    }
  }, [id, onOpen])

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
            <AccordionItem w="full">
              <AccordionButton px={0} py={1}>
                <Flex
                  direction="row"
                  pr={4}
                  gap={[2, 4]}
                  justify="space-between"
                  align="left"
                  w="full"
                >
                  <h3>Filter</h3>
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
                  options={fields['user_type'].meta.options.choices.filter((item) =>
                    allowedUserTypes.includes(item.value as UserType)
                  )}
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
              value={s || size}
              onChange={(e) => {
                setSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
            <Select
              value={o || sort}
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
            {!isOpen &&
              members?.map((member: SearchableMember) => (
                <MemberCard key={member.id} member={member} onOpen={onOpen} />
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
                isDisabled={page == 1}
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
                isDisabled={page == pageCount}
                icon={<ArrowRightIcon h={3} w={3} />}
                ml={4}
                aria-label="Last Page"
              />
            </Flex>
          </Flex>
        </form>
      </FormProvider>
      <Modal
        size="2xl"
        isOpen={isOpen}
        onClose={() => {
          onClose()
          router.back()
        }}
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent
          bg={useColorModeValue('white', 'black')}
          border="1px solid transparent"
          borderColor="accent.700"
        >
          <ModalHeader>
            <MemberHeader id={id as string} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MemberSpotlight id={id as string} fields={fields} />
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
    </Page>
  )
}

function MemberCard({ member, onOpen }: { member: Partial<SearchableMember>; onOpen: () => void }) {
  const router = useRouter()
  return (
    <>
      <LinkBox key={member?.id}>
        <Card
          w="full"
          h="full"
          bg={useColorModeValue('white', 'black')}
          border="1px solid transparent"
          borderColor="accent.700"
          _hover={{ shadow: '2xl', borderColor: 'accent.500' }}
        >
          <CardHeader>
            <LinkOverlay
              as={NextLink}
              href={`/members/${member?.id}`}
              onClick={(e) => {
                e.preventDefault()
                router
                  .push({
                    pathname: `/members/${member?.id}`,
                  })
                  .then(() => onOpen())
              }}
            >
              <UserCard user={member} />
            </LinkOverlay>
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
    </>
  )
}

function PropertyGroup({
  k,
  member,
  show,
  fieldList,
  fields,
  color,
  minCols = 1,
  maxCols = 3,
}: {
  k: string
  member: Member
  show: boolean
  fieldList: string[]
  fields: Record<string, DirectusField>
  color: string
  maxCols?: number
  minCols?: number
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
    <SimpleGrid columns={[minCols, 2, maxCols]} spacing={1} alignItems="start">
      {fieldList?.map((field, i: number) => (
        <GridItem
          key={`${field}-${i}`}
          colSpan={Array.isArray(member[field]) ? [minCols, 2, maxCols] : minCols}
        >
          {member[field] &&
            (Array.isArray(member[field]) ? (
              <>
                <h5>{capitalCase(fields[field].field)}:</h5>
                <Wrap gap={2}>
                  {member[field]?.map((item: any, d: number) => (
                    <Badge colorScheme={color} key={`badge-${item}`}>
                      {getValue(field, item)}
                    </Badge>
                  ))}
                </Wrap>
              </>
            ) : (
              <>
                <h5>{capitalCase(fields[field].field)}:</h5>
                <h4 style={{ textTransform: 'capitalize' }}>{getValue(field, member[field])}</h4>
              </>
            ))}
        </GridItem>
      ))}
    </SimpleGrid>
  )
}

function MemberSpotlight({ id, fields }: { id: string; fields: Record<string, DirectusField> }) {
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
              k="profile"
              member={member}
              fieldList={memberProfileFields}
              show={member?.show_profile}
              fields={fields}
              color="green"
            />
          </TabPanel>
          <TabPanel>
            <PropertyGroup
              k="explicit"
              member={member}
              fieldList={memberProfileExplicitFields}
              show={member?.show_explicit}
              fields={fields}
              color="red"
            />
          </TabPanel>
          <TabPanel>
            <PropertyGroup
              k="interests"
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
              k="health"
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
              k="contact"
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

function MemberHeader({ id }: { id: string }) {
  const { member, loading } = useMember(id)
  if (loading || !member) return <></>
  return (
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
  )
}

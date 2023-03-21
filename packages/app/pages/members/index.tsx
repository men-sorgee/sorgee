import { ManyItems } from '@directus/sdk'
import Page from 'components/Page'
import { signIn } from 'next-auth/react'
import { useUser } from 'hooks'
import { pruneUndefined, normalize, serialize } from 'lib/utils'
import { useEffect, useState, createRef } from 'react'
import { MemberSpotlight, MemberCard } from 'components/controls'
import { ArrowRightIcon, ArrowLeftIcon, ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import {
  Flex,
  HStack,
  Stat,
  StatGroup,
  Select,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Heading,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Container,
  useColorModeValue,
  useDisclosure,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import useSWR from 'swr'
import {
  FieldMap,
  SearchableMember,
  UserType,
  MemberLevel,
  getAllowedUsers,
  Member,
} from 'lib/models'
import { JsonFetcher } from 'lib/utils'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FieldCheckboxes, FieldInput, FieldCheckbox } from 'components/forms'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

export type QueryParams = Record<keyof SearchableMember, string[]> & {
  online: boolean
  photos: boolean
  page: number
  size: number
  sort: string
}

export type PageProps = {
  fieldMap: FieldMap
  id?: string
  params?: QueryParams
}

export async function getServerSideProps(context: NextPageContext): Promise<{ props: PageProps }> {
  const { getFields } = await import('lib/services/directus/server')
  const fieldMap = await getFields('users')
  const params = (context.query as unknown as QueryParams) || ({} as QueryParams)
  return {
    props: {
      fieldMap,
      params,
    },
  }
}

type Meta = {
  total: number
  filtered: number
}
export default function MemberListPage(props: PageProps) {
  const { member: currentMember, loading } = useUser()
  const router = useRouter()
  const { fieldMap: fields, id: i, params } = props
  const { page: p, size: s, sort: o, id: _, ...q } = router.query || params

  const [id, setId] = useState(i)
  const [page, setPage] = useState<number>(undefined)
  const [size, setSize] = useState<number>(undefined)
  const [sort, setSort] = useState<string>(undefined)
  const [key, setKey] = useState<string>(undefined)
  const [pageCount, setPageCount] = useState<number>(undefined)
  const [members, setMembers] = useState<SearchableMember[]>(undefined)
  const [query, setQuery] = useState<QueryParams>(undefined)
  const [title, setTitle] = useState<string>(undefined)
  const [description, setDescription] = useState<string>(undefined)
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    filtered: 0,
  })
  const topRef = createRef<HTMLDivElement>()
  useEffect(() => {
    let sz = Number(s || '20')
    let pg = Number(p || '1')
    let so = String(o || '-last_login')

    if (page == undefined) setPage(pg)
    if (size == undefined) setSize(sz)
    if (sort == undefined) setSort(so)

    if (query == undefined && q != undefined) {
      setQuery(normalize<SearchableMember>(q) as QueryParams)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!currentMember) {
      return
    }

    if (id) {
      window.history.pushState({}, null, `/members/${id}`)
    } else {
      if (loading || page == undefined || size == undefined || sort == undefined) return
      const filter = query ? serialize<SearchableMember>(query) : ''
      window.history.pushState(
        null,
        'Men Nearby',
        `/members?page=${page}&size=${size}&sort=${sort}${filter}`
      )
      setTitle('Men Nearby')
      setDescription('View and find other men.')

      setKey(`/api/members?limit=${size}&page=${page}&sort=${sort}${filter}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setId, page, size, sort, query, loading, currentMember])

  const methods = useForm<QueryParams>({
    mode: 'onBlur',
    defaultValues: {
      ...query,
      ...normalize<SearchableMember>(q),
      online: q.online ? true : undefined,
      photos: q.photos ? true : undefined,
    },
  })

  const { data: response } = useSWR<ManyItems<Partial<SearchableMember>>>(key, JsonFetcher)

  useEffect(() => {
    setPage(1)
  }, [size])

  useEffect(() => {
    if (response?.data && response?.meta) {
      const { total_count, filter_count } = response.meta
      setMeta({
        total: total_count || 0,
        filtered: filter_count || 0,
      })
      setPageCount(filter_count > 0 ? Math.ceil(filter_count / size) : 0)
      setMembers(response.data)

      document.querySelector('main')?.scroll({ top: 0, behavior: 'smooth' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response?.data, response?.meta, key, size])

  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    if (id) {
      onOpen()
    } else {
      onClose()
    }
  }, [id, setId, onOpen, onClose])

  const sortDir = sort?.startsWith('-') ? '-' : ''
  const sortTerm = sort?.startsWith('-') ? sort.slice(1) : sort || 'last_login'

  return (
    <Page
      title={title || 'Men Nearby'}
      description={description}
      loading={loading}
      w="full"
      requireAuth={true}
    >
      <FormProvider {...methods}>
        <form
          id="filter-form"
          onSubmit={methods.handleSubmit((d) => {
            let newQuery = pruneUndefined(d, (v) => v !== false) as QueryParams

            setQuery(newQuery)
            setPage(1)
          })}
          style={{ width: '100%', display: 'block' }}
        >
          <div ref={topRef}></div>
          <FilterFields fields={fields} currentMember={currentMember} meta={meta} />

          <Flex gap={4} mt={4} align="center">
            <Select
              value={size || 20}
              onChange={(e) => {
                setSize(Number(e.target.value))
              }}
            >
              {[20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
            {sortDir == '' && (
              <IconButton
                aria-label="Ascending"
                title="Sorted by ascending. Click to sort by descending"
                icon={<ArrowDownIcon height={20} />}
                onClick={() => setSort(`-${sortTerm}`)}
              />
            )}
            {sortDir == '-' && (
              <IconButton
                aria-label="Ascending"
                title="Sorted by descending. Click to sort by ascending"
                icon={<ArrowUpIcon height={20} />}
                onClick={() => setSort(sortTerm)}
              />
            )}
            <Select
              value={sortTerm}
              onChange={(e) => {
                setSort(`${sortDir}${e.target.value}`)
              }}
            >
              <option value="last_login">Recently Online</option>
              <option value="date_created">Registration Date</option>
              <option value="nickname">By Username</option>
              <option value="rating">Rating</option>
            </Select>
          </Flex>
          <Pager page={page} pageCount={pageCount} setPage={setPage} />
          <SimpleGrid my={4} columns={[1, 1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
            {members?.map((member: SearchableMember) => (
              <MemberCard key={member.id} member={member} onClick={() => setId(member.id)} />
            ))}
          </SimpleGrid>
          {meta.filtered == 0 && (
            <Container w="4xl" textAlign="center">
              <Text>No results found</Text>
            </Container>
          )}
          <Pager page={page} pageCount={pageCount} setPage={setPage} />
        </form>
      </FormProvider>
      <Modal size="full" isOpen={isOpen} onClose={() => setId(undefined)}>
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent
          bg={useColorModeValue('white', 'black')}
          border="1px solid transparent"
          borderColor="accent.700"
        >
          <ModalBody px={1}>
            <MemberSpotlight id={id as string} fields={fields}>
              <ModalCloseButton color={'white'} mt={2} />
            </MemberSpotlight>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Page>
  )
}

type FilterProps = {
  fields: FieldMap
  meta: Meta
  currentMember: Member
}
const FilterFields = ({ fields, meta, currentMember }: FilterProps) => {
  const [showItem, setShowItem] = useState<any>(undefined)
  const allowedUserTypes = getAllowedUsers(MemberLevel[currentMember?.user_type || 'inductee'])
  const router = useRouter()
  return (
    <>
      <Accordion
        allowToggle
        w="full"
        shadow="lg"
        defaultIndex={showItem}
        onChange={(i) => {
          setShowItem(i)
        }}
      >
        <AccordionItem w="full">
          <AccordionButton px={0} py={1} _expanded={{ bg: 'primary', color: 'white' }}>
            <Flex direction="row" pr={4} gap={[2, 4]} justify="space-between" align="left" w="full">
              <Heading as="h3" size="h3" mt={1} ml={2}>
                Filter
              </Heading>
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
            <SimpleGrid columns={[1, 1, 2]} spacing={4} mb={4}>
              <FieldInput field="nickname" label="Nickname" />
              <FieldInput field="biography" label="Keywords" />
              <FieldCheckbox field="online" label="Is Online" />
              <FieldCheckbox field="photos" label="Has Photos" />
            </SimpleGrid>
            <SimpleGrid columns={1} spacing={4} mb={4}>
              <FieldCheckboxes
                field="user_type"
                label="User Level"
                options={fields['user_type'].meta.options.choices.filter((item) =>
                  allowedUserTypes.includes(item.value as UserType)
                )}
              />
              {/**<FieldCheckboxes
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
             />**/}
            </SimpleGrid>

            <AccordionButton as={'div'} mt={6} _hover={{ bg: 'transparent', cursor: 'default' }}>
              <HStack w="full" justify="center">
                <Button size="lg" type="submit" colorScheme="primary">
                  Search
                </Button>
                <Button
                  type="reset"
                  size="lg"
                  colorScheme="blue"
                  onClick={(e) => {
                    router.replace('/members')
                  }}
                >
                  Clear
                </Button>
              </HStack>
            </AccordionButton>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}

type PagerProps = { page: number; pageCount: number; setPage: any }
const Pager = ({ page, pageCount, setPage }: PagerProps) => {
  if (pageCount == undefined || pageCount == 0) return null
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Flex>
          <IconButton
            onClick={() => setPage(1)}
            isDisabled={page == 1}
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
            isDisabled={page >= pageCount}
            icon={<ChevronRightIcon h={6} w={6} />}
            aria-label="Next Page"
          />
          <IconButton
            onClick={() => setPage(pageCount)}
            isDisabled={page >= pageCount}
            icon={<ArrowRightIcon h={3} w={3} />}
            ml={4}
            aria-label="Last Page"
          />
        </Flex>
      </Flex>
    </>
  )
}

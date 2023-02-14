import { ManyItems } from '@directus/sdk'
import Page from 'components/Page'
import { signIn } from 'next-auth/react'
import { useMember } from 'hooks/use-member'
import { UserAddIcon, StarIcon, ChatIcon } from '@heroicons/react/solid'
import { pruneUndefined, normalize, serialize } from 'lib/utils'
import { useEffect, useState } from 'react'
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
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import useSWR from 'swr'
import {
  DirectusField,
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
import { FieldCheckboxes, FieldInput } from 'components/forms'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/outline'
type PageProps = Record<string, string[]> & {
  fieldMap: FieldMap
  id?: string
}
type QueryParams = Record<keyof SearchableMember, string[]>

type FieldMap = Record<string, DirectusField>
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

type Meta = {
  total: number
  filtered: number
}
export default function MemberListPage(props: PageProps) {
  const { member: currentMember, loading } = useMember()
  const router = useRouter()
  const { fieldMap: fields, id: i, ...params } = props
  const { page: p, size: s, sort: o, id: _, ...q } = router.query || params

  const [id, setId] = useState(i)
  const [page, setPage] = useState<number>(undefined)
  const [size, setSize] = useState<number>(undefined)
  const [sort, setSort] = useState<string>(undefined)
  const [sortTerm, setSortTerm] = useState<string>(undefined)
  const [sortDir, setSortDir] = useState<string>(undefined)
  const [key, setKey] = useState<string>(undefined)
  const [pageCount, setPageCount] = useState<number>(undefined)
  const [members, setMembers] = useState<SearchableMember[]>(undefined)
  const [query, setQuery] = useState<QueryParams>(undefined)

  const [meta, setMeta] = useState<Meta>({
    total: 0,
    filtered: 0,
  })

  useEffect(() => {
    let sz = Number(s || '10')
    let pg = Number(p || '1')
    let so = String(o || '-last_login')

    if (page == undefined) setPage(pg)
    if (size == undefined) setSize(sz)
    if (sort == undefined) {
      let d = so.startsWith('-') ? '-' : ''
      let t = so.startsWith('-') ? so.slice(1) : so
      setSortDir(d)
      setSortTerm(t)
      setSort(so)
    }
    if (query == undefined && q != undefined) {
      setQuery(normalize<SearchableMember>(q) as QueryParams)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading && !currentMember) {
      signIn()
      return
    }

    if (id) {
      window.history.pushState({}, null, `/members/${id}`)
    } else {
      if (loading || page == undefined || size == undefined || sort == undefined) return
      const filter = query ? serialize<SearchableMember>(query) : ''
      window.history.pushState(
        null,
        'Members',
        `/members?page=${page}&size=${size}&sort=${sort}${filter}`
      )
      setKey(`/api/members?limit=${size}&offset=${size * (page - 1)}&sort=${sort}${filter}`)
    }
  }, [id, setId, page, size, sort, query, loading, currentMember])

  const methods = useForm<QueryParams>({
    mode: 'onBlur',
    defaultValues: { ...query, ...normalize<SearchableMember>(q) },
  })

  const { data: response } = useSWR<ManyItems<Partial<SearchableMember>>>(key, JsonFetcher)

  useEffect(() => {
    setPage(1)
  }, [size])

  useEffect(() => {
    //if (sort) {
    //  setSortDir(sort.startsWith('-') ? '-' : '')
    //  setSortTerm(sort.startsWith('-') ? sort.slice(1) : sort)
    //}
  }, [sort])

  useEffect(() => {
    setSort(`${sortDir}${sortTerm}`)
  }, [sortDir, sortTerm])

  useEffect(() => {
    if (response?.data && response?.meta) {
      const { total_count, filter_count } = response.meta
      setMeta({
        total: total_count || 0,
        filtered: filter_count || 0,
      })
      setPageCount(filter_count > 0 ? Math.ceil(filter_count / size) - 1 : 0)
      setMembers(response.data)
      window?.scrollTo(0, 0)
    }
  }, [response?.data, response?.meta, key, size])

  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    if (id) {
      onOpen()
    } else {
      onClose()
    }
  }, [id, setId, onOpen, onClose])

  return (
    <Page title="Members" loading={loading} w="full" requireAuth={true}>
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
          <FilterFields fields={fields} currentMember={currentMember} meta={meta} />

          <Flex gap={4} mt={4} align="center">
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
              value={sortTerm}
              onChange={(e) => {
                setSortTerm(e.target.value)
              }}
            >
              <option value="last_login">Recently Online</option>
              <option value="nickname">By Username</option>
              <option value="rating">Rating</option>
            </Select>
            {sortDir == '' && (
              <IconButton
                aria-label="Ascending"
                title="Sorted by ascending. Click to sort by descending"
                icon={<ArrowDownIcon height={20} />}
                onClick={() => setSortDir('-')}
              />
            )}
            {sortDir == '-' && (
              <IconButton
                aria-label="Ascending"
                title="Sorted by descending. Click to sort by ascending"
                icon={<ArrowUpIcon height={20} />}
                onClick={() => setSortDir('')}
              />
            )}
          </Flex>
          <Pager page={page} pageCount={pageCount} setPage={setPage} />
          <SimpleGrid my={4} columns={[1, 1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
            {members?.map((member: SearchableMember) => (
              <MemberCard key={member.id} member={member} onClick={() => setId(member.id)} />
            ))}
          </SimpleGrid>
          {pageCount == 0 && (
            <Container w="4xl" textAlign="center">
              <Text>No results found</Text>
            </Container>
          )}
          <Pager page={page} pageCount={pageCount} setPage={setPage} />
        </form>
      </FormProvider>
      <Modal size="2xl" isOpen={isOpen} onClose={() => setId(undefined)} scrollBehavior="inside">
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent
          bg={useColorModeValue('white', 'black')}
          border="1px solid transparent"
          borderColor="accent.700"
        >
          <ModalCloseButton />
          <ModalBody>
            <MemberSpotlight id={id as string} fields={fields} />
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
              <Heading mt={1} ml={2} as="h3">
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
            <SimpleGrid columns={[1, 1, 2]} spacing={4}>
              <FieldInput field="nickname" label="Nickname" />
              <FieldInput field="biography" label="Keywords" />
            </SimpleGrid>
            <FieldCheckboxes
              field="user_type"
              label="User Level"
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

            <AccordionButton as={'div'} _hover={{ bg: 'transparent', cursor: 'default' }}>
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
  if (pageCount == undefined) return null
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

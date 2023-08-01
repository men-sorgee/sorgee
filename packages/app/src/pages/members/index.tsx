import { createRef, useCallback, useEffect, useState } from 'react'

import { Lazy, MemberCard, MemberModal, Pager } from 'components/controls'
import { FieldCheckbox, FieldCheckboxes, FieldInput } from 'components/forms'
import Page from 'components/Page'
import { addDays } from 'date-fns'
import { useUser } from 'hooks'
import {
  FieldMap,
  getAllowedUsers,
  Member,
  MemberLevel,
  SearchableMember,
  UserType,
  MemberStats
} from 'lib/models'
import {
  getJSON,
  JsonFetcher,
  normalize,
  pruneUndefined,
  serialize
} from 'lib/utils'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import useSWR from 'swr'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Select,
  SimpleGrid,
  Spacer,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { ManyItems } from '@directus/sdk'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'

export type QueryParams = Record<keyof SearchableMember, string[]> & {
  online: boolean
  photos: boolean
  page: number
  size: number
  sort: string
}

export type PageProps = {
  fields: FieldMap
}

export async function getServerSideProps(
  context: NextPageContext
): Promise<{ props: PageProps }> {
  const { getFields } = await import('lib/services/directus/server')
  const fields = await getFields('users')
  return {
    props: {
      fields
    }
  }
}

type Meta = {
  total: number
  filtered: number
}
export default function MemberListPage({ fields }: PageProps) {
  const { member: currentMember, loading } = useUser({
    minLevel: MemberLevel.brother,
    requiredFeature: 'view_directory',
    redirectsEnabled: true
  })
  const router = useRouter()
  const { page: p, size: s, sort: o, ...q } = router.query

  const [id, setId] = useState(undefined)
  const [page, setPage] = useState<number>(undefined)
  const [size, setSize] = useState<number>(undefined)
  const [sort, setSort] = useState<string>(undefined)
  const [key, setKey] = useState<string>(undefined)
  const [pageCount, setPageCount] = useState<number>(undefined)
  const [members, setMembers] = useState<SearchableMember[]>(undefined)
  const [query, setQuery] = useState<QueryParams>(undefined)
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    filtered: 0
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

    if (loading || page == undefined || size == undefined || sort == undefined)
      return
    const filter = query ? serialize<SearchableMember>(query) : ''
    setKey(`/api/members?limit=${size}&page=${page}&sort=${sort}${filter}`)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, sort, query, loading, currentMember])

  const methods = useForm<QueryParams>({
    mode: 'onBlur',
    defaultValues: {
      ...query,
      ...normalize<SearchableMember>(q),
      online: q.online ? true : undefined,
      photos: q.photos ? true : undefined
    }
  })

  const { data: response } = useSWR<ManyItems<Partial<SearchableMember>>>(
    key,
    JsonFetcher
  )

  useEffect(() => {
    setPage(1)
  }, [size])

  useEffect(() => {
    if (response?.data && response?.meta) {
      const { total_count, filter_count } = response.meta
      setMeta({
        total: total_count || 0,
        filtered: filter_count || 0
      })
      setPageCount(filter_count > 0 ? Math.ceil(filter_count / size) : 0)
      setMembers(response.data)

      document.querySelector('main')?.scroll({ top: 0, behavior: 'smooth' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response?.data, response?.meta, key, size])

  const sortDir = sort?.startsWith('-') ? '-' : ''
  const sortTerm = sort?.startsWith('-') ? sort.slice(1) : sort || 'last_login'

  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    if (id) {
      onOpen()
    } else {
      onClose()
    }
  }, [id, setId, onOpen, onClose])

  const close = useCallback(() => {
    onClose()
    setId(undefined)
  }, [onClose])

  return (
    <Page title={'Men Nearby'} description={''} loading={loading} w="full">
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
          <FilterFields
            fields={fields}
            currentMember={currentMember}
            meta={meta}
          />

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
          <SimpleGrid
            my={4}
            columns={[1, 1, 1, 2]}
            spacing={4}
            w="full"
            justifyItems="stretch"
          >
            {members?.map((member: SearchableMember) => (
              <Lazy key={member.id}>
                <MemberCard
                  full
                  size="xl"
                  key={member.id}
                  viewer={currentMember}
                  member={member}
                  onClick={() => setId(member.id)}
                />
              </Lazy>
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

      <MemberModal isOpen={isOpen} memberId={id as string} onClose={close} />
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
  const level = MemberLevel[currentMember?.user_type || 'inductee']
  const allowedUserTypes = getAllowedUsers(level)
  const router = useRouter()

  if (fields == undefined) return null
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
          <AccordionButton
            px={0}
            py={1}
            _expanded={{ bg: 'primary', color: 'white' }}
          >
            <Flex
              direction="row"
              pr={4}
              gap={[2, 4]}
              justify="space-between"
              w="full"
            >
              <Heading as="h3" size="h3" mt={1} ml={2}>
                Filter
              </Heading>
              <Spacer />
              <StatGroup mt={1}>
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
              <FieldInput field="keywords" label="Keywords" />
              <FieldCheckbox field="online" label="Is Online" />
              <FieldCheckbox field="photos" label="Has Photos" />
            </SimpleGrid>
            <SimpleGrid columns={1} spacing={4} mb={4}>
              <FieldCheckboxes
                field="user_type"
                label="User Level"
                options={fields['user_type'].meta.options.choices.filter(
                  (item) => allowedUserTypes.includes(item.value as UserType)
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

            <AccordionButton
              as={'div'}
              mt={6}
              _hover={{ bg: 'transparent', cursor: 'default' }}
            >
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

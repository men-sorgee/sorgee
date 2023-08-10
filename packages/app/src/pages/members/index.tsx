import {
  Lazy,
  Loading,
  MemberCard,
  MemberModal,
  Page,
  Pager
} from "components";
import { FieldCheckbox, FieldCheckboxes, FieldInput } from "components/forms";
import { useFields, useMemberSearch, useUser } from "hooks";
import {
  FieldMap,
  getAllowedUsers,
  Member,
  MemberLevel,
  MemberSearchQueryParams,
  SearchableMember,
  UserType
} from "lib/models";
import { pruneUndefined } from "lib/utils";
import { useRouter } from "next/router";
import { createRef, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

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
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

type Meta = {
  total: number
  filtered: number
}

export default function Members() {
  const router = useRouter()
  const { fields, loading: fieldsLoading } = useFields('users')
  const { member: currentMember, loading } = useUser({
    minLevel: MemberLevel.brother,
    requiredFeature: 'view_directory',
    redirectsEnabled: true,
  })

  let { page: p, size: s, sort: o, i, ...query } = router.query
  const page = Number(p || '1')
  const size = Number(s || '20')
  const sort = String(o || '-last_login')

  const [id, setId] = useState(undefined)
  useEffect(() => {
    if (id == undefined && 1) {
      setId(i)
    }
  }, [i, id, setId])

  const setParams = useCallback(
    (q: Partial<MemberSearchQueryParams>) => {
      //let url = `/members?${new URLSearchParams({ page, size, ...q } as any).toString()}`
      router.push({
        pathname: '/members',
        query: { page, size, sort, ...query, ...q },
      })
    },
    [page, query, router, size, sort]
  )

  const topRef = createRef<HTMLDivElement>()
  const methods = useForm<MemberSearchQueryParams>({
    mode: 'onBlur',
    defaultValues: query,
  })

  const {
    members,
    pageCount,
    meta,
    loading: membersLoading,
    sortTerm,
    direction,
  } = useMemberSearch({ page, size, sort, ...query })

  const { isOpen, onClose } = useDisclosure({
    onClose: () => setId(undefined),
    isOpen: id != undefined,
  })

  return (
    <Page title={'Men Nearby'} description={''} loading={loading || fieldsLoading} w="full">
      <FormProvider {...methods}>
        <form
          id="filter-form"
          onSubmit={methods.handleSubmit((d: MemberSearchQueryParams) => {
            let newQuery = pruneUndefined(d, (v) => v !== false) as MemberSearchQueryParams
            setParams({ ...query, ...newQuery, page: 1, size })
          })}
          style={{ width: '100%', display: 'block' }}
        >
          <div ref={topRef}></div>
          <FilterFields fields={fields} currentMember={currentMember} meta={meta} />
        </form>

        <Flex gap={4} mt={4} align="center">
          <Select
            value={size || 20}
            onChange={(e) => {
              setParams({ size: Number(e.target.value || 20), page: 1, sort })
            }}
          >
            {[20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
          {(direction == 'asc' && (
            <IconButton
              aria-label="Ascending"
              title="Sorted by ascending. Click to sort by descending"
              icon={<ArrowDownIcon height={20} />}
              onClick={() => setParams({ sort: `-${sortTerm}`, page: 1 })}
            />
          )) || (
            <IconButton
              aria-label="Ascending"
              title="Sorted by descending. Click to sort by ascending"
              icon={<ArrowUpIcon height={20} />}
              onClick={() => setParams({ sort: sortTerm, page: 1 })}
            />
          )}
          <Select
            value={sortTerm}
            onChange={(e) => {
              setParams({
                sort: `${direction == 'desc' ? '-' : ''}${e.target.value}`,
                page: 1,
              })
            }}
          >
            <option value="last_login">Recently Online</option>
            <option value="date_created">Registration Date</option>
            <option value="nickname">By Username</option>
            <option value="rating">Rating</option>
          </Select>
        </Flex>

        <Pager {...{ page, size, pageCount, sort, ...query }} />

        {(membersLoading && <Loading />) || (
          <>
            <SimpleGrid my={4} columns={[1, 1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
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
          </>
        )}
        <Pager {...{ page, size, pageCount, sort, ...query }} />
      </FormProvider>

      <MemberModal
        isOpen={isOpen}
        onClose={onClose}
        memberId={id as string}
        size={['lg', 'xl', '2xl']}
      />
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
          <AccordionButton px={0} py={1} _expanded={{ bg: 'primary', color: 'white' }}>
            <Flex direction="row" pr={4} gap={[2, 4]} justify="space-between" w="full">
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
                    router.push('/members')
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

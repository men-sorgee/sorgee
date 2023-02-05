import { ManyItems } from '@directus/sdk'
import Page from 'components/Page'
import { useMember } from 'hooks/use-member'
import { JsonFetcher } from 'lib/utils/fetchers'
import { Profile } from 'next-auth'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { UserCard } from 'components/ui'
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
  IconButton,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { SearchableMember, searchableMemberFields } from '../../lib/models'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'

type Props = Record<keyof SearchableMember, any> & {
  page: number
  size: number
}

export function getServerSideProps(context: NextPageContext) {
  const { page: rawPage, size: rawSize, ...filter } = context.query
  const page = Number(rawPage) > 0 ? rawPage : 1
  const size = Number(rawSize) || 20

  return {
    props: {
      page,
      size,
      ...filter,
    },
  }
}

export default function MemberListPage({ page = 1, size = 20, ...filters }: Props) {
  const { member, loading } = useMember()
  const router = useRouter()
  const [filter, setFilter] = useState<string>()
  const getQuery = (page: number, size: number, filter: string) => {
    return `/members?page=${page + 1}&size=${size}${filter}`
  }
  useEffect(() => {
    if (filters) {
      setFilter(
        Object.keys(filters)
          .filter((k) => searchableMemberFields.includes(k as any))
          .reduce((acc, key) => {
            return `${acc}&${key}=${filters[key]}`
          }, '')
      )
    }
  }, [filter, filters])

  const [pageIndex, setPageIndex] = useState(page - 1)
  const [pageSize, setPageSize] = useState(size)
  const [query, setQuery] = useState<string>()

  const gotoPage = useCallback(
    (index: number) => {
      setPageIndex(index)
      setQuery(getQuery(index, pageSize, filter || ''))
      router.replace(query).then(() => {
        window.scrollTo(0, 0)
      })
    },
    [pageSize, router, query, filter]
  )

  const showItems = useCallback(
    (size: number) => {
      setPageSize(size)
      setQuery(getQuery(pageIndex, size, filter || ''))
      router.replace(query).then(() => {
        window.scrollTo(0, 0)
      })
    },
    [pageSize, pageIndex, filter, router, query]
  )

  const { data: response, error } = useSWR<ManyItems<Partial<Profile>>>(
    `/api/members?limit=${pageSize}&offset=${pageSize * pageIndex}${filter || ''}`,
    JsonFetcher
  )

  const [pageCount, setPageCount] = useState(0)
  const [members, setMembers] = useState<SearchableMember[]>()
  const [meta, setMeta] = useState<{ total: number; filtered: number }>({ total: 0, filtered: 0 })
  useEffect(() => {
    const { data: members, meta } = response || {}
    setMembers(members || [])
    if (meta) {
      setMeta({
        total: meta.total_count,
        filtered: meta.filter_count,
      })
      setPageCount(Math.ceil(meta.filter_count / pageSize))
    } else {
      setPageCount(0)
      setMeta({
        total: 0,
        filtered: 0,
      })
    }
  }, [response, pageCount, pageSize, pageIndex, meta])

  const cardBg = useColorModeValue('white', 'black')

  return (
    <Page title="Members" loading={loading} w="full">
      {meta && (
        <StatGroup as={HStack} spacing={20}>
          <Stat>
            <StatLabel>Total</StatLabel>
            <StatNumber>{meta.total}</StatNumber>
          </Stat>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              showItems(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
          <Stat>
            <StatLabel>Filtered</StatLabel>
            <StatNumber>{meta.filtered}</StatNumber>
          </Stat>
        </StatGroup>
      )}
      <Accordion allowToggle w="full">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Filter Members
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <SimpleGrid my={5} columns={[1, 2, 3, 4]} spacing={4} w="full" justifyItems="stretch">
        {member &&
          members &&
          members.map((member: any) => {
            return (
              <Link key={member.id} _hover={{ textDecoration: 'none' }}>
                <Card
                  w="full"
                  h="full"
                  bg={cardBg}
                  p={4}
                  border="1px solid transparent"
                  _hover={{ shadow: 'xl', borderColor: 'accent.500' }}
                >
                  <UserCard user={member} />
                </Card>
              </Link>
            )
          })}
      </SimpleGrid>
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => gotoPage(0)}
              isDisabled={pageIndex == 0}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
              aria-label="First Page"
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={() => gotoPage(pageIndex - 1)}
              isDisabled={pageIndex == 0}
              icon={<ChevronLeftIcon h={6} w={6} />}
              aria-label="Previous Page"
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" mx={8}>
            Page{' '}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{' '}
            of{' '}
            <Text fontWeight="bold" as="span">
              {pageCount}
            </Text>
          </Text>

          <Tooltip label="Next Page">
            <IconButton
              onClick={() => gotoPage(pageIndex + 1)}
              isDisabled={pageCount == 0 || pageIndex + 1 >= pageCount}
              icon={<ChevronRightIcon h={6} w={6} />}
              aria-label="Next Page"
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={pageCount == 0 || pageIndex + 1 >= pageCount}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
              aria-label="Last Page"
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Page>
  )
}

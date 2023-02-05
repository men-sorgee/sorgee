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
  Badge,
  Wrap,
} from '@chakra-ui/react'
import { SearchableMember, searchableMemberFields } from 'lib/models'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { Rating } from 'components/ui'

type Props = Record<keyof SearchableMember, any> & {
  page: number
  size: number
  sort_by: 'nickname' | 'last_login' | 'user_type' | 'rating'
  sort_dir: 'asc' | 'desc'
}

const getSearch = (params: Record<string, any>) => {
  return Object.keys(params)
    .filter((k) => searchableMemberFields.includes(k as any))
    .reduce((acc, key) => {
      return `${acc}&${key}=${params[key]}`
    }, '')
}

export default function MemberListPage({}: Props) {
  const router = useRouter()
  const { page = 1, size = 20, sort_by = 'presence', sort_dir = 'desc', ...filters } = router.query
  const { member, loading } = useMember()
  const [filter, setFilter] = useState<string>(getSearch(filters))
  const [direction, setDirection] = useState<'asc' | 'desc'>(sort_dir as 'asc' | 'desc')
  const [sort, setSort] = useState<string>(sort_by as string)
  const [pageIndex, setPageIndex] = useState(Number(page) - 1)
  const [pageSize, setPageSize] = useState(Number(size))
  const [pageUrl, setPageUrl] = useState<string>()
  const [sortExpression, setSortExpression] = useState<string>(
    direction == 'desc' ? `-${sort}` : sort
  )

  useEffect(() => {
    if (pageUrl != router.asPath) {
      let url =
        `/members?page=${pageIndex + 1}` +
        `&size=${pageSize}&sort_by=${sort}&sort_dir=${direction}${filter}`
      if (!pageUrl || pageUrl != url) {
        setPageUrl(url)
      }
    }
  }, [
    sort_by,
    sort_dir,
    sort,
    direction,
    pageIndex,
    pageSize,
    filter,
    filters,
    pageUrl,
    router.asPath,
  ])

  const { data: response, error } = useSWR<ManyItems<Partial<Profile>>>(
    `/api/members?limit=${pageSize}&offset=${pageSize * pageIndex}&sort=${sortExpression}${filter}`,
    JsonFetcher
  )

  const [pageCount, setPageCount] = useState(0)
  const [members, setMembers] = useState<SearchableMember[]>()
  const [meta, setMeta] = useState<{ total: number; filtered: number }>({ total: 0, filtered: 0 })

  useEffect(() => {
    const { data, meta } = response || {}
    if (data) {
      setMembers(data)
      window.scrollTo(0, 0)
    } else {
      setMembers([])
    }

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
  }, [router, pageCount, pageSize, meta, response])

  const handlePageChange = useCallback(() => {
    router.replace(pageUrl)
  }, [pageUrl, router])

  const cardBg = useColorModeValue('white', 'black')

  return (
    <Page title="Members" loading={loading} w="full">
      {meta && (
        <Flex gap={2} align="center" justify="space-between" my={2}>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
          <Select
            w={32}
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
            }}
          >
            <option value="last_login">Last Login</option>
            <option value="presence">Online</option>
            <option value="nickname">Name</option>
            <option value="user_type">Level</option>
            <option value="rating">Rating</option>
          </Select>
          <Select
            w={32}
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value as 'asc' | 'desc')
            }}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </Select>
        </Flex>
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
          <AccordionPanel></AccordionPanel>
        </AccordionItem>
      </Accordion>
      <StatGroup as={HStack} spacing={4}>
        <Stat>
          <StatLabel>Total</StatLabel>
          <StatNumber>{meta.total}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Filtered</StatLabel>
          <StatNumber>{meta.filtered}</StatNumber>
        </Stat>
      </StatGroup>
      <SimpleGrid my={5} columns={[1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
        {member &&
          members &&
          members.map((member: SearchableMember) => {
            return (
              <Link key={member.id} _hover={{ textDecoration: 'none' }}>
                <Card
                  as={Flex}
                  direction="row"
                  justify="stretch"
                  gap={2}
                  justifyContent="space-between"
                  w="full"
                  h="full"
                  bg={cardBg}
                  p={4}
                  border="1px solid transparent"
                  _hover={{ shadow: 'xl', borderColor: 'accent.500' }}
                >
                  <Flex direction="column" align="start" justify="space-between">
                    <UserCard user={member} />
                    <Rating
                      value={member.rating || 0}
                      mt={2}
                      aria-label="User Rating"
                      size="xxs"
                      simple
                    />
                  </Flex>
                  <Flex
                    direction="column"
                    align="end"
                    justify="space-between"
                    alignItems="flex-end"
                  >
                    <Flex wrap="wrap" gap={2} align="end" justify="end" direction="row-reverse">
                      {member?.my_positions?.map((position, i) => (
                        <Badge key={i} colorScheme="secondary">
                          {position}
                        </Badge>
                      ))}
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            )
          })}
      </SimpleGrid>
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => setPageIndex(0)}
              isDisabled={pageIndex == 0}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
              aria-label="First Page"
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={() => setPageIndex(pageIndex - 1)}
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
              onClick={() => setPageIndex(pageIndex + 1)}
              isDisabled={pageCount == 0 || pageIndex + 1 >= pageCount}
              icon={<ChevronRightIcon h={6} w={6} />}
              aria-label="Next Page"
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => setPageIndex(pageCount - 1)}
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

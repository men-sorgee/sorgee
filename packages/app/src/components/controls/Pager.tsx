import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon
} from '@chakra-ui/icons'
import { Flex, IconButton, Text } from '@chakra-ui/react'

export type PagerProps = { page: number; pageCount: number; setPage: any }

export const Pager = ({ page, pageCount, setPage }: PagerProps) => {
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

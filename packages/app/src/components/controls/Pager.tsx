import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";

export type PagerProps = {
  page: number
  pageCount: number
  setPage: (page: number) => void
}

export const Pager = ({ page = 1, pageCount = 1, setPage }: PagerProps) => {
  if (pageCount == undefined || pageCount == 0) return null
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Flex>
          <IconButton
            onClick={() => setPage(1)}
            isDisabled={Number(page) == 1}
            icon={<ArrowLeftIcon h={3} w={3} />}
            mr={4}
            aria-label="First Page"
          />
          <IconButton
            onClick={() => setPage(Number(page) - 1)}
            isDisabled={Number(page) == 1}
            icon={<ChevronLeftIcon h={6} w={6} />}
            aria-label="Previous Page"
          />
        </Flex>
        <Flex alignItems="center">
          <Text flexShrink="0" mx={8}>
            <Text fontWeight="bold" as="span">
              {Number(page)}
            </Text>
            {' / '}
            <Text fontWeight="bold" as="span">
              {pageCount}
            </Text>
          </Text>
        </Flex>
        <Flex>
          <IconButton
            onClick={() => setPage(Number(page) + 1)}
            isDisabled={Number(page) >= pageCount}
            icon={<ChevronRightIcon h={6} w={6} />}
            aria-label="Next Page"
          />
          <IconButton
            onClick={() => setPage(pageCount)}
            isDisabled={Number(page) >= pageCount}
            icon={<ArrowRightIcon h={3} w={3} />}
            ml={4}
            aria-label="Last Page"
          />
        </Flex>
      </Flex>
    </>
  )
}

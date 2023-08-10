import { MemberSearchQueryParams } from "lib/models";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";

import { ButtonLink } from "./ButtonLink";

export type PagerProps = Partial<MemberSearchQueryParams> & {
  //page: number
  //size: number
  //query: MemberSearchQueryParams
  //setPage: (page: number) => void
  pageCount: number
}

export const Pager = ({ page, size, pageCount, ...query }: PagerProps) => {
  if (pageCount == undefined || pageCount == 0) return null
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Flex>
          <ButtonLink
            href={`/members?${new URLSearchParams({
              page: 1,
              size,
              ...query,
            } as any).toString()}`}
            isDisabled={Number(page) == 1}
            icon={<ArrowLeftIcon h={3} w={3} />}
            mr={4}
            aria-label="First Page"
          />

          <ButtonLink
            href={`/members?${new URLSearchParams({
              page: page - 1,
              size,
              ...query,
            } as any).toString()}`}
            isDisabled={Number(page) == 1}
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
          <ButtonLink
            href={`/members?${new URLSearchParams({
              page: page + 1,
              size,
              ...query,
            } as any).toString()}`}
            isDisabled={Number(page) >= pageCount}
            icon={<ChevronRightIcon h={6} w={6} />}
            aria-label="Next Page"
          />
          <ButtonLink
            href={`/members?${new URLSearchParams({
              page: pageCount,
              size,
              ...query,
            } as any).toString()}`}
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

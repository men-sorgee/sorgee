import { Rating as RatingControl } from "components/controls";
import { Rating, RatingCollection } from "lib/models";
import { JsonFetcher, postJSON } from "lib/utils";
import { ReactNode, useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import { Box, Flex } from "@chakra-ui/react";

import { RatingControlProps } from "./Rating";

export type RateItemProps = RatingControlProps & {
  item_id: string
  collection: RatingCollection
  onChange?: (rate: number) => void
  children?: ReactNode
  direction?:
    | 'row'
    | 'column'
    | 'row-reverse'
    | 'column-reverse'
    | Array<'row' | 'column' | 'row-reverse' | 'column-reverse'>
}

const itemMap = {
  users: 'member',
  events: 'event'
}

export const RateItem = ({
  item_id,
  collection,
  onChange = () => {},
  direction = ['column', 'row'],
  children,
  ...props
}: RateItemProps) => {
  const [value, setValue] = useState<number>(undefined)
  const { data = [], mutate } = useSWR<Rating[], Error>(
    `/api/my/ratings`,
    JsonFetcher,
    {
      fallbackData: []
    }
  )
  const ratings = data
    .filter((r) => r.collection == collection)
    .map((r) => {
      return { ...r, item_id: r[itemMap[collection]] as string }
    })
  const [rating, setRating] = useState<Rating>(undefined)
  useEffect(() => {
    if (ratings && !rating) {
      const r = ratings.find((r) => r.item_id == item_id)
      setRating(r)
    }
    if (rating && value == undefined) {
      setValue(rating.rate)
    }
  }, [ratings, rating, value, item_id])

  const onRateChange = useCallback(
    async (rate: number) => {
      const { success, data: r } = await postJSON<Rating>(
        `/api/my/ratings/${collection}/${item_id}`,
        { rate } as any
      )
      if (!success) {
        await mutate(
          data.map((r) => {
            if (r[itemMap[collection]] == item_id) {
              return { ...r, rate }
            }
            return r
          })
        )
        setValue(rate)
        onChange(rate)
      }
    },
    [collection, data, item_id, mutate, onChange]
  )

  return (
    <Flex direction={direction} gap={2} align="center" justify="center">
      <Box>{children}</Box>
      <RatingControl
        value={value}
        readonly={false}
        simple
        onRateChange={onRateChange as any}
        aria-label={'Rating ' + collection}
        {...props}
      />
    </Flex>
  )
}

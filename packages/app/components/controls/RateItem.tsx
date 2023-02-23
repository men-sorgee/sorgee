import useSWR from 'swr'
import { JsonFetcher, postJSON } from 'lib/utils'
import { Rating, RatingCollection } from 'lib/models'
import { useState, useEffect, useCallback } from 'react'
import { Rating as RatingControl } from 'components/controls'

export const RateItem = ({
  item_id,
  collection,
}: {
  item_id: string
  collection: RatingCollection
}) => {
  const [value, setValue] = useState<number>(undefined)
  const key = `/api/member/ratings?collection=${collection}&item=${item_id}`
  const { data: rating, mutate } = useSWR<Rating, Error>(key, JsonFetcher)

  useEffect(() => {
    if (rating && value == undefined) {
      setValue(rating.rate)
    }
  }, [rating, value])

  const onRateChange = useCallback(
    async (rate: number) => {
      console.log(`posting ${rate} to ${key}`)
      const { success, data: r } = await postJSON<Rating>(key, { rate } as any)
      if (!success) {
        await mutate(r)
        setValue(rate)
      }
    },
    [key, mutate, setValue]
  )

  return (
    <RatingControl
      value={value}
      readonly={false}
      simple
      onRateChange={onRateChange as any}
      aria-label={'Rate this.'}
    />
  )
}

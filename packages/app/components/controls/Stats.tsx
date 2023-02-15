import { Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import { capitalCase } from 'change-case'
import { JsonFetcher } from 'lib/utils'
import useSWR from 'swr'
import { Loading } from './Loading'
export default function Stats() {
  const { data, error } = useSWR('/api/stats', JsonFetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <Loading />
  return (
    data &&
    Object.keys(data).map((key) => (
      <Stat key={key}>
        <StatLabel>{capitalCase(key)}</StatLabel>
        <StatNumber>{data[key]}</StatNumber>
      </Stat>
    ))
  )
}

import { addDays } from 'date-fns'
import {
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Flex,
  StatArrow,
  StatHelpText
} from '@chakra-ui/react'
import { Loading } from './Loading'
import useSWR from 'swr'
import { MemberStats } from 'lib/models'

export function MemberStats() {
  const daysAgo = addDays(new Date(new Date().toDateString()), -14)
  const { data: stats, isLoading } = useSWR<MemberStats>('/api/stats')
  const { data: statsR, isLoading: isLoadingR } = useSWR<MemberStats>(
    `/api/stats?start=${daysAgo.toISOString()}`
  )

  if (isLoading || isLoadingR) return <Loading />

  return (
    <StatGroup
      alignContent="center"
      justifyContent="space-between"
      justifyItems="stretch"
      as={Flex}
      w="full"
      flexWrap={'wrap'}
      gap={4}
      p={[1, 2, 4]}
    >
      <Stat textAlign="center">
        <StatLabel>Applicants</StatLabel>
        <StatNumber>{stats.applicants}</StatNumber>
        {statsR.applicants > 0 && (
          <StatHelpText title="In the past 14 days">
            <StatArrow type="increase" />+ {statsR.applicants}
          </StatHelpText>
        )}
      </Stat>
      <Stat textAlign="center">
        <StatLabel>Pledges</StatLabel>
        <StatNumber>{stats.pledges}</StatNumber>
        {statsR.pledges > 0 && (
          <StatHelpText title="In the past 14 days">
            <StatArrow type="increase" />+ {statsR.pledges}
          </StatHelpText>
        )}
      </Stat>
      <Stat textAlign="center">
        <StatLabel>Inductees</StatLabel>
        <StatNumber>{stats.inductees}</StatNumber>

        {statsR.inductees > 0 && (
          <StatHelpText title="In the past 14 days">
            <StatArrow type="increase" />+ {statsR.inductees}
          </StatHelpText>
        )}
      </Stat>
      <Stat textAlign="center">
        <StatLabel>Brothers</StatLabel>
        <StatNumber>{stats.brothers}</StatNumber>
        {statsR.brothers > 0 && (
          <StatHelpText title="In the past 14 days">
            <StatArrow type="increase" />+ {statsR.brothers}
          </StatHelpText>
        )}
      </Stat>

      <Stat textAlign="center">
        <StatLabel whiteSpace="nowrap">Big-Brothers</StatLabel>
        <StatNumber>{stats.big_brothers}</StatNumber>
        {statsR.big_brothers > 0 && (
          <StatHelpText title="In the past 14 days">
            <StatArrow type="increase" />+ {statsR.big_brothers}
          </StatHelpText>
        )}
      </Stat>
    </StatGroup>
  )
}

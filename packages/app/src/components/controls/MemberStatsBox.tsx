import { addDays } from "date-fns";
import { Member, MemberStats } from "lib/models";
import { ReactNode } from "react";
import useSWR from "swr";

import {
  Box,
  BoxProps,
  chakra,
  Flex,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber
} from "@chakra-ui/react";

export type MemberStatsBoxProps = BoxProps & {
  member: Member
  children?: ReactNode
}

export const MemberStatsBox = chakra(({ member, children, ...props }) => {
  const { data: stats, isLoading } = useSWR<MemberStats>('/api/stats', {
    revalidateOnMount: true,
    fallbackData: {
      subscribers: 0,
      applicants: 0,
      pledges: 0,
      inductees: 0,
      brothers: 0,
      big_brothers: 0,
      staff: 0,
    },
  })
  const daysAgo = addDays(new Date(new Date().toDateString()), -14)
  const { data: statsR, isLoading: isLoadingR } = useSWR<MemberStats>(
    `/api/stats?start=${daysAgo.toISOString()}`,
    {
      fallbackData: {
        subscribers: 0,
        applicants: 0,
        pledges: 0,
        inductees: 0,
        brothers: 0,
        big_brothers: 0,
        staff: 0,
      },
    }
  )

  return (
    <Box {...props}>
      {children}

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
    </Box>
  )
})

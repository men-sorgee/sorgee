import { capitalCase } from "change-case";
import { Member } from "lib/models";
import { QuestionResult, SurveyResult } from "lib/db/entities";
import { JsonFetcher } from "lib/utils";
import { ReactNode } from "react";
import swr from "swr";

import {
  Box,
  Heading,
  Tag,
  Text,
  useColorModeValue,
  Wrap
} from "@chakra-ui/react";

export type EventSurveyAnswersProps = {
  surveyId: string
  member: Pick<Member, 'picture' | 'id' | 'nickname'>
  headingSize?: string
}

export function EventSurveyAnswers({
  surveyId,
  member,
  headingSize = 'md',
}: EventSurveyAnswersProps) {
  const { data: survey, isLoading } = swr<SurveyResult>(
    `/api/survey/${surveyId}/results`,
    JsonFetcher
  )
  const color = useColorModeValue('gray.800', 'white')
  if (isLoading) return <Text p={2}>Loading...</Text>

  let badgeProps = {
    rounded: 'lg',
    px: 2,
    py: 1,
    size: ['sm', 'md'],
    color: 'white',
    my: 1,
  }

  const Result = ({
    result,
    children,
  }: {
    result: QuestionResult
    children?: ReactNode
  }) => {
    const bg = (value: number) => {
      if (value > 75) return 'red.400'
      if (value > 50) return 'orange.400'
      if (value > 25) return 'yellow.400'
      if (value > 10) return 'green.400'
      return 'green.300'
    }
    const data: { [key: string]: number } = JSON.parse(result.aggregated_result || '{}') as any
    if (!result) return <>(No result)</>
    switch (result.question_type) {
      case 'number':
        const number: number = Number(result.aggregated_result)
        return (
          <>

            <Tag bg="primary.400" {...badgeProps}>
              <pre>Average: {Math.round(number)} / 5</pre>
            </Tag>
          </>
        )
      case 'number_array':
      case 'string_array':
        return (
          <Wrap gap={3}>
            {Object.keys(data).map((key, i) =>
              <Tag key={i} bg={bg(data[key])}  {...badgeProps} >
                <pre>{capitalCase(key)}: {data[key]}</pre>
              </Tag>)}
          </Wrap>
        )
      case 'boolean':
        return (
          <Wrap gap={3}>
            {['true', 'false'].map((key, i) =>
              <Tag key={i} bg={bg(data[key])}  {...badgeProps} >
                <pre>{key == 'true' ? 'Yes' : 'No'}: {data[key] || 0}</pre>
              </Tag>)}
          </Wrap>
        )

      default:
        if (result.aggregated_result == undefined) return <>(no result)</>
        return (
          (result.question_type == 'color' && (
            <>

              <Tag bg="secondary.400" {...badgeProps}>
                <pre>{JSON.stringify(result.aggregated_result)}</pre>
              </Tag>
            </>
          )) || (
            <>

              <Tag bg="accent.400" {...badgeProps}>
                <pre>{JSON.stringify(result.aggregated_result)}</pre>
              </Tag>
            </>
          )
        )
    }
  }

  return (
    <>
      <Heading as="h3" size="h3" my={0}>
        {survey?.name} Results
      </Heading>

      {survey?.questions.map(
        (question: QuestionResult, index: number) => (
          <Box key={index} mb={2}>
            <Heading as='h4' size='md' color={color}>
              {question.question}
            </Heading>
            <Result result={question}>
            </Result>
          </Box>
        )
      )}
    </>
  )
}
